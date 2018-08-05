import React, { Component } from 'react';
import web3 from './web3';
import ipfs from './ipfs';
import discardedRelics from './discardedRelics';

class AddNewRelic extends Component {
  state = {
  	accounts: [],
    value: '0',
    imageIpfsHash: null,
    metaDataIpfsHash: null,
    message: ''
  };

  async componentDidMount(){
    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts });
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
  };

  onSubmit = async(event) => {
    event.preventDefault();
    console.log('Adding to ipfs...');
    const file = document.getElementById('fileInput').files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = async() => {
      let buffer = await Buffer.from(reader.result);
      //console.log(buffer);
      await ipfs.add(buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash);
        let imageIpfsHash = ipfsHash[0].hash;
        this.setState({ imageIpfsHash: imageIpfsHash });
        this.addMetaDataToIPFS(imageIpfsHash);
      });
    }
  };

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
  }

  makeMetaData = async(imageIpfsHash) => {
    let metaData = {};
    metaData.imageIpfsHash = imageIpfsHash;
    metaData.title = document.getElementById('metaDataTitle').value;
    metaData.when = document.getElementById('metaDataWhen').value;
    metaData.where = document.getElementById('metaDataWhere').value;
    metaData.who = document.getElementById('metaDataWho').value;
    metaData.whyGot = document.getElementById('metaDataWhyGot').value;
    metaData.whyDiscard = document.getElementById('metaDataWhyDiscard').value;
    metaData.comment = document.getElementById('metaDataComment').value;
    console.log(metaData);
    return metaData;
  }

  addNewToken = async(imageIpfsHash, metaDataIpfsHash) => {
    this.setState({ message: 'Waiting on transaction success...' });
    await discardedRelics.methods.mint(imageIpfsHash, metaDataIpfsHash).send({
      from: this.state.accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });
    this.setState({ message: 'New token have been added!'});
  }

  render() {
    return (
      <div className="AddNewRelic">
        <h2>Add Your Discarded Relic</h2>

        <form onSubmit={this.onSubmit}>
          <MetaDataInputTable /><br />
          <button>Add</button>
        </form>

        <h4>{this.state.imageIpfsHash}</h4>
        <h4>{this.state.metaDataIpfsHash}</h4>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

const MetaDataInputTable = () => {
  return (
    <table>
      <tbody>
        <tr>
          <td><label>Photo </label></td>
          <td><input type="file" onChange={this.captureFile} id="fileInput" /></td>
        </tr>
        <MetaDataInputTr data={{label: 'Title', id: 'metaDataTitle'}} />
        <MetaDataInputTr data={{label: 'When did you get this?', id: 'metaDataWhen'}} />
        <MetaDataInputTr data={{label: 'Where did you get this?', id: 'metaDataWhere'}} />
        <MetaDataInputTr data={{label: 'Who from this?', id: 'metaDataWho'}} />
        <MetaDataInputTr data={{label: 'Why did you get this?', id: 'metaDataWhyGot'}} />
        <MetaDataInputTr data={{label: 'Why do you discard this?', id: 'metaDataWhyDiscard'}} />
        <MetaDataInputTr data={{label: 'Comment', id: 'metaDataComment'}} />
    </tbody>
  </table>
  );
}

const MetaDataInputTr = (props) => {
  return (
    <tr>
      <td><label>{props.data.label} </label></td>
      <td><input id={props.data.id} /></td>
    </tr>
  );
}

export default AddNewRelic;
