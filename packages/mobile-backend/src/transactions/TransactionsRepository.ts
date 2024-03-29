import { Injectable } from "@nestjs/common";
import { ITransactionsRepository } from "./interfaces";

@Injectable()
class TransactionsRepository implements ITransactionsRepository {

}

export default TransactionsRepository;
