import { ObjectType } from "@nestjs/graphql";
import { Paginated, PageInfo } from "../common/paginated/types";
import Movement from "./Movement";

@ObjectType()
class PaginatedMovements extends Paginated(Movement) {
  public constructor(
    totalCount: number,
    pageInfo: PageInfo,
    nodes: Movement[],
  ) {
    super(totalCount, pageInfo, nodes, (movement: Movement) =>
      movement.version.toString(10),
    );
  }
}

export default PaginatedMovements;
