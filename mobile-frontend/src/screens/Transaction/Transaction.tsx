import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Linking,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import tw from "twrnc";
import { StackScreenProps } from "@react-navigation/stack";
import BN from "bn.js";

import { Text } from "@postero/ui";

import { ModalStackParams } from "../params";
import NavBar from "../../ui/NavBar";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import { PendingTransactionState } from "./PendingTransactionState";

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});

const GET_TRANSACTION = gql`
  query GetTransaction($hash: Bytes!) {
    transaction(hash: $hash) {
      hash

      ... on UserTransaction {
        version
        timestamp
        success
        sender
        moduleAddress
        moduleName
        functionName
        arguments
      }

      ... on GenesisTransaction {
        version
      }

      ... on PendingTransaction {
        status
        payload
        createdAt
        expirationTimestamp
      }
    }
  }
`;

function Transaction({
  route,
  navigation,
}: StackScreenProps<ModalStackParams, "Transaction">) {
  const { data, loading, error } = useQuery<{
    transaction: null | {
      __typename: "UserTransaction";
      hash: string;
      version: string;
      timestamp: string;
      success: boolean;
      sender: string;
      moduleAddress: string;
      moduleName: string;
      functionName: string;
      arguments: string;
    } | {
      __typename: "GenesisTransaction";
      hash: string;
      version: string;
    } | {
      __typename: "PendingTransaction";
      hash: string;
      status: string;
      createdAt: number;
      expirationTimestamp: number;
      payload: string;
    };
  }>(GET_TRANSACTION, {
    variables: {
      hash: route.params.hash,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  let transactionView: React.JSX.Element | null = null;

  switch (data?.transaction?.__typename) {
    case "PendingTransaction": {
      const pendingTransaction = data.transaction;

      transactionView = (
        <View style={{ paddingHorizontal: 5 }}>
          <PendingTransactionState
            hash={Buffer.from(pendingTransaction.hash, "hex")}
          />

          <View style={styles.separator} />

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Payload</Text>
            <Text>{pendingTransaction.payload}</Text>
          </View>
        </View>
      );

    } break;

    case "GenesisTransaction": {
      const genesisTransaction = data.transaction;

      transactionView = (
        <View style={{ paddingHorizontal: 5 }}>
          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Type</Text>
            <Text>Genesis transaction</Text>
          </View>

          <View style={styles.separator} />

          {/* <View style={styles.propertyContainer}>
            <Text style={styles.label}>Timestamp</Text>
            <Text>
              {dateTimeFormatter.format(
                new Date(
                  new BN(userTransaction.timestamp)
                    .div(new BN(1e3))
                    .toNumber()
                )
              )}
            </Text>
          </View>

          <View style={styles.separator} /> */}

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `https://0l.fyi/transactions/${genesisTransaction.version}`
              );
            }}
          >
            <View style={styles.propertyContainer}>
              <Text style={styles.label}>Version</Text>
              <Text>
                {parseInt(genesisTransaction.version, 10).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>

        </View>
      );

    } break;

    case "UserTransaction":
      {
        const userTransaction = data.transaction;

        transactionView = (
          <View style={{ paddingHorizontal: 5 }}>
            <View style={styles.propertyContainer}>
              <Text style={styles.label}>Type</Text>
              <Text>User transaction</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.propertyContainer}>
              <Text style={styles.label}>Timestamp</Text>
              <Text>
                {dateTimeFormatter.format(
                  new Date(
                    new BN(userTransaction.timestamp)
                      .div(new BN(1e3))
                      .toNumber()
                  )
                )}
              </Text>
            </View>

            <View style={styles.separator} />

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  `https://0l.fyi/transactions/${userTransaction.version}`
                );
              }}
            >
              <View style={styles.propertyContainer}>
                <Text style={styles.label}>Version</Text>
                <Text>
                  {parseInt(userTransaction.version, 10).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <View style={styles.propertyContainer}>
              <Text style={styles.label}>Method</Text>
              <Text>{`${userTransaction.moduleAddress}::${userTransaction.moduleName}::${userTransaction.functionName}`}</Text>
            </View>

            <View style={styles.separator} />

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  `https://0l.fyi/accounts/${userTransaction.sender}`
                );
              }}
            >
              <View style={styles.propertyContainer}>
                <Text style={styles.label}>Sender</Text>
                <Text>{userTransaction.sender}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <View style={styles.propertyContainer}>
              <Text style={styles.label}>Success</Text>
              <Text>{`${userTransaction.success}`}</Text>
            </View>
          </View>
        );
      }
      break;

    default: {
      transactionView = (
        <View style={{ paddingHorizontal: 5 }}>
          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Hash</Text>
            <Text>{route.params.hash}</Text>
          </View>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <NavBar
        title="Transaction"
        leftActions={
          <TouchableOpacity
            style={tw.style("p-2")}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="#000000" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ flex: 1 }}>{transactionView}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  propertyContainer: {
    paddingVertical: 10,
  },
  label: {
    color: "rgb(113, 113, 122)",
    marginBottom: 5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "rgba(9, 9, 11, 0.05)",
  },
});

export default Transaction;
