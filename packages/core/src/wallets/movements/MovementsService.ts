import { Inject, Injectable } from '@nestjs/common';
import {
  IMovement,
  IMovementsRepository,
  IMovementsService,
} from './interfaces';
import { Types } from '../../types';

@Injectable()
class MovementsService implements IMovementsService {
  @Inject(Types.IMovementsRepository)
  private readonly movementsRepository: IMovementsRepository;

  public async getWalletMovements(walletId: Uint8Array): Promise<IMovement[]> {
    const movements =
      await this.movementsRepository.getWalletMovements(walletId);

    return movements;
  }
}

export default MovementsService;
