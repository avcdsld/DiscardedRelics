import web3 from './web3';
import DiscardedRelicToken from "./contracts/DiscardedRelicToken.json";

//const address = DiscardedRelicToken['networks']['5777']['address'];
const address = DiscardedRelicToken['networks']['5778']['address'];
const abi =  DiscardedRelicToken['abi'];

export default new web3.eth.Contract(abi, address);
