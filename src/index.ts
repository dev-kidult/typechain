import * as CryptoJS from "crypto-js";

class Block {
  static caculateBlockHash = (
    index: number,
    previousHash: string,
    timestemp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestemp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timeStemp === "number" &&
    typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timeStemp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timeStemp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timeStemp = timeStemp;
  }
}

const genesisBlock: Block = new Block(0, "2020202020", "", "hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLastestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStemp = (): number => Math.round(new Date().getTime() / 1000);

const createBlock = (data: string): Block => {
  const previousBlock: Block = getLastestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStemp: number = getNewTimeStemp();
  const newHash: string = Block.caculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimeStemp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStemp
  );
  addBlock(newBlock);
  return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.caculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timeStemp,
    aBlock.data
  );

const isBlokcValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlokcValid(candidateBlock, getLastestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createBlock("second block");
createBlock("third block");
createBlock("fourth block");

console.log(blockchain);