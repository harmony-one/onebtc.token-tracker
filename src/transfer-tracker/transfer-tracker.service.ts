import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventTrackerService } from 'src/event-tracker/event-tracker.service';
import { EventEmitter } from "events";
import { abi } from '../abi';
import { Web3Service } from "nest-web3";
import { Contract } from 'web3-eth-contract';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfers } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransferTrackerService {
  private readonly logger = new Logger(TransferTrackerService.name);
  private eventTracker: EventTrackerService;

  private subscriptionContract: Contract;

  constructor(
    private configService: ConfigService,

    private readonly web3Service: Web3Service,

    @InjectRepository(Transfers)
    private transfersRep: Repository<Transfers>,
  ) {
    const eventEmitter = new EventEmitter();

    this.eventTracker = new EventTrackerService({
      contractAbi: abi,
      contractAddress: process.env.HMY_ONE_BTC_CONTRACT,
      rpcUrl: process.env.HMY_NODE_URL,
      eventEmitter,
      getEventCallback: async (res) => {
        if (res.name === "Transfer") {
          let item = await transfersRep.findOne({ where: { hash: res.transactionHash } });

          if (!item) {
            // try {
              await this.transfersRep.save({
                from: res.returnValues.from,
                to: res.returnValues.to,
                value: res.returnValues.value,
                hash: res.transactionHash,
                blockNumber: res.blockNumber,
              });
            // } catch (e) {
            //   this.logger.error(e, res);
            // }
          }
        }
      }
    }, this.web3Service);

    this.eventTracker.start();
  }

  async getTransfers() {
    return await this.transfersRep.findAndCount({ take: 100 });
  }

  getInfo = () => {
    return this.eventTracker.getInfo();
  }
}
