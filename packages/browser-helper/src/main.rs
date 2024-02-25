use std::mem::transmute;

use futures_util::{future, pin_mut, StreamExt};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

// A simple proxy for browser native messages from web browser to web socket server.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging

#[tokio::main]
async fn main() {
    let (stdin_tx, stdin_rx) = futures_channel::mpsc::unbounded();
    tokio::spawn(read_stdin(stdin_tx));

    let (ws_stream, _) = connect_async("ws://127.0.0.1:9292")
        .await
        .expect("Failed to connect");
    let (write, read) = ws_stream.split();

    let stdin_to_ws = stdin_rx.map(Ok).forward(write);

    let ws_to_stdout = {
        read.for_each(|res| async {
            match res {
                Ok(message) => {
                    let data = message.into_data();

                    let payload = String::from_utf8(data).expect("Invalid UTF-8 data");

                    let size: u32 = payload.len().try_into().unwrap();
                    let size_buff: [u8; 4] = unsafe { transmute(size.to_le()) };

                    let mut stdout = tokio::io::stdout();
                    stdout.write(&size_buff).await.unwrap();
                    stdout.write(payload.as_bytes()).await.unwrap();
                    stdout.flush().await.unwrap();
                }
                _ => {
                    std::process::exit(1);
                }
            }
        })
    };

    pin_mut!(stdin_to_ws, ws_to_stdout);
    future::select(stdin_to_ws, ws_to_stdout).await;
}

async fn read_stdin(tx: futures_channel::mpsc::UnboundedSender<Message>) {
    let mut stdin = tokio::io::stdin();
    loop {
        let mut size_buf: [u8; 4] = [0; 4];
        match stdin.read_exact(&mut size_buf).await {
            Ok(_) => (),
            Err(_) => break,
        }

        let size = u32::from_le_bytes(size_buf);
        let size: usize = match size.try_into() {
            Ok(size) => size,
            Err(_) => break,
        };

        if size == 0 {
            break;
        }

        let mut bytes = vec![0x00; size];
        match stdin.read_exact(&mut bytes).await {
            Ok(_) => {}
            Err(_) => break,
        }

        let str = match String::from_utf8(bytes) {
            Ok(str) => str,
            Err(_) => break,
        };

        tx.unbounded_send(Message::text(str)).unwrap();
    }
}
