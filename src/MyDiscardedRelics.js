import React, { Component } from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import discardedRelics from './discardedRelics';

class MyDiscardedRelics extends Component {
  state = {
  	accounts: [],
    symbol: '',
    tokensCount: '',
    tokens: [],
  };

  async componentDidMount(){
    const accounts = await web3.eth.getAccounts();
    const symbol = await discardedRelics.methods.symbol().call();
    const tokensCount = await discardedRelics.methods.balanceOf(accounts[0]).call();
    const tokenIds = await discardedRelics.methods.tokensOf(accounts[0]).call();
    const tokens = [];
    for (let i = 0; i < tokenIds.length; i++) {
      let result = await discardedRelics.methods.getDiscardedRelic(Number(tokenIds[i])).call();
      const token = {};
      token.id = tokenIds[i];
      token.imageIpfsHash = result[0];
      token.metaDataIpfsHash = result[1];
      token.owner = result[2];
      tokens.push(token);
    }
    console.log(tokens);
    this.setState({ accounts, symbol, tokensCount, tokens });
  }

  render() {
    return (
      <div className="MyDiscardedRelics">
        <h2>My Discarded Relics</h2>
        <p>
          Address: {this.state.accounts[0]} <br/>
          Tokens: {this.state.tokensCount} {this.state.symbol} <br/>
        </p>

        {this.state.tokens.map((token, index) => {
          return (
            <div key={index} className="DiscardedRelic">
              <DiscardedRelic token={token} />
            </div>
          );
        })}
      </div>
    );
  }
}

const DiscardedRelic = (props) => {
  let imgUrl = "https://ipfs.io/ipfs/" + props.token.imageIpfsHash;
  let metaDataUrl = "https://ipfs.io/ipfs/" + props.token.metaDataIpfsHash;
  return (
    <React.Fragment>
      <h4>#{props.token.id}</h4>
      <img src={imgUrl} alt={"#" + props.token.id} width="200" border="0" />
      <ul>
        <li><a href={imgUrl}>photo</a></li>
        <li><a href={metaDataUrl}>metaData</a></li>
      </ul>
    </React.Fragment>
  );
}

/*
addMetaDataToIPFS = async(imageIpfsHash) => {
  // ref: https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
  let metaData = await this.makeMetaData(imageIpfsHash);
  let buffer = await Buffer.from(JSON.stringify(metaData));
  await ipfs.add(buffer, (err, ipfsHash) => {
    console.log(err, ipfsHash);
    let metaDataIpfsHash = ipfsHash[0].hash;
    this.setState({ metaDataIpfsHash: metaDataIpfsHash });
    console.log('Adding to IPFS has been finished!');
    console.log("url: https://ipfs.io/ipfs/" + metaDataIpfsHash);
    this.addNewToken(imageIpfsHash, metaDataIpfsHash);
  });
}*/

export default MyDiscardedRelics;
