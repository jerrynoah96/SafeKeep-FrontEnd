import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import safeKeepAbi from './safekeepabi.json';
import sfkpABI from './SFKP.json';
import getWeb3 from './getWeb3';
import Modal from 'react-modal';



import { Navbar, Container, Col, Row, Card, Button  } from 'react-bootstrap';
Modal.setAppElement('#root');
class App extends Component {

  constructor(props){
    super(props)
    this.state={
      web3: null,
      account: null,
      safeKeepInstance: null,
      ethDepo: false,
      ethWithdraw: false,
      ethDepoAmount:null,
      ethWithdrawAmount: null,
      backUpAddress: null,
      ethBalance: " ",
      regStatus: false,
      lastPing: "",
      daiDepo: false,
      daiWithdraw: false,
      daiDepoAmount: null,
      daiWithdrawAmount: null
    }

    this.handleUserInput = this.handleUserInput.bind(this)
    
  }
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
     this.setState({
        web3
      })

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      this.setState({
        account
      })

      //Instantiate SafeKeep Contract
      const safeKeepAddress = "0xa055dFC2190bA3C147D96C69eD5e11442A59525f";
      const safeKeepInstance = new web3.eth.Contract(safeKeepAbi, safeKeepAddress);
      this.setState({
        safeKeepInstance
      })
      console.log(this.state.safeKeepInstance, 'safeKeep Instance')


      //Load Ether balannce upon opening the app
      const ethBalance = await this.state.safeKeepInstance.methods.getBalance().call();
      this.setState({
        ethBalance
      })

      //get last Ping
     
     


      //automatically register address
   /*   alert("Let's get you registered")
      const regRes = await this.state.safeKeepInstance.methods.isUser(this.state.account).send({from: this.state.account});
      console.log(regRes, 'regsitration result')
      console.log(regRes.status, 'registration status')
      alert("you can now go ahead to deposit your funds!")
*/



      

      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };




//function to deposit ether
  depositEther = async (e)=> {
    console.log(this.state.ethDepoAmount, this.state.backUpAddress)
    console.log(this.state.safeKeepInstance, 'yes?')
    e.preventDefault();
    const amount= this.state.web3.utils.toWei(this.state.ethDepoAmount, 'ether')
    await this.state.safeKeepInstance.methods.depositEther(this.state.backUpAddress).send({
      from: this.state.account,
      value: amount
    })

    alert("You have successfully deposited " + this.state.ethDepoAmount);
  }


//function to check ether balance

withdrawEther = async(e)=> {
  e.preventDefault();
  console.log(this.state.safeKeepInstance, 'for withdraw')
  await this.state.safeKeepInstance.methods.withdraw(this.state.ethWithdrawAmount).send({
    from: this.state.account
  })

  alert("withdraw successful")
}

//function to PING

pingHandler = async(e)=> {
 const pingRes = await this.state.safeKeepInstance.methods.ping().send({
    from: this.state.account
  })

  console.log(pingRes, 'ping result')

 
}

getPing = async(e)=> {
   await this.state.safeKeepInstance.methods.getLastPing().call({
    from: this.state.account
  })
     
}









  handleUserInput(e){
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  render(){

  
  return (
  <div className="App">
      <Navbar bg="dark" variant="dark" className="rounded-top">
    <Navbar.Brand href="#home">
      <img
        alt=""
        src="./LogoWhite.png"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      Dashboard  
    </Navbar.Brand>
   
         <span className="navbar-text flex-end  ">{this.state.account}</span>
    
  </Navbar>

  <Container className="pt-5">
    <h6 className="mb-n4"> Hide Balance less than eth </h6> 
     <input type="checkbox" className="margin"></input>
     <button border="dark "  className= "box position pad " style={{ width: '6rem', height: '2.5rem'}} 
     onClick={this.getPing}>Admin</button>
  </Container>
  
<Container className="pt-5 pb-4">
  <Row>
  <Col sm={7}>

  <Card border="dark" style={{ width: '30rem', height: '13rem', } }>
    <Card.Body>
    <Row>
      <Col sm={7}>
        <h4 className="pt-4 ">ETH Balance</h4>
      <h4>{this.state.ethBalance}ETH</h4>
       </Col>
       <Col sm={5}>
           <h4 className="pt-4 ">$1234.00</h4>
           <div border="dark"  className= "box" style={{ width: '6rem', height: '2.5rem'}} >4.5%</div>
       </Col>
    </Row>
    <div className="pt-3 mt-2">
   <Button variant="outline-dark" style={{ width: '8rem'} } className=" mx-4" 
   onClick={()=> {this.setState({ethDepo: true})}}>Deposit</Button>{' '}
      <Button variant="outline-dark" style={{ width: '8rem'}} 
       onClick={()=> {this.setState({ethWithdraw: true})}}>Withdraw</Button>
     </div>  
    </Card.Body>
  </Card>

  <br/>
<>{
  //POP UP MODAL TO DEPOSIT ETHER
  <Modal isOpen={this.state.ethDepo}
  onRequestClose={()=>{this.setState({ethDepo: false})}} className="modal-popup">
   <Card border="dark" style={{ width: '30rem', height: '13rem',top:'2' } } ClassName='mb-5'>
          <div class="form-card">
            <h4 class="text-center mb-4 mt-3">DEPOSIT</h4>
            <form class="form-inline" onSubmit={this.depositEther}>
              <div class="form-group mx-sm-3 mb-2">
                <label htmlFor="deposit" class="sr-only">
                  ETH
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="deposit"
                  placeholder="Amount in ETH"
                  name= "ethDepoAmount"
                  value={this.state.ethDepoAmount}
                  onChange= {this.handleUserInput}
                 
                />
              </div>
              <div class="form-group mx-sm-3 mb-2">
                <label htmlFor="address" class="sr-only">
                  ETH
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  placeholder="Backup Address"
                  name= "backUpAddress"
                  value={this.state.backUpAddress}
                  onChange= {this.handleUserInput}
                
                />
              </div>
              <div className="center">
              <button
              
                type="submit"
               
                className="btn btn-primary ml-5"
                
              >
                Deposit
              </button>
              </div>
            </form>
          </div>
         
        </Card> 
      </Modal>
      //END OF POP UP MODAL TO DEPOSIT ETHER

       
}
</>

{
  // POP UP MODAL TO WITHDRAW ETH
  <Modal isOpen={this.state.ethWithdraw}
  onRequestClose={()=>{this.setState({ethWithdraw: false})}} className="modal-popup"> 
 <Card border="dark" style={{ width: '30rem', height: '13rem',top:'2' } } ClassName='mb-5'>
          <div class="form-card">
            <h4 class="text-center mb-4 mt-3">Withdraw</h4>
            <form class="form-inline" onSubmit={this.withdrawEther}>
              <div class="form-group mx-sm-3 mb-2">
                <label htmlFor="deposit" class="sr-only">
                  ETH
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="deposit"
                  placeholder="Amount in ETH"
                  name= "ethWithdrawAmount"
                  value={this.state.ethWithdrawAmount}
                  onChange= {this.handleUserInput}
                 
                />
              </div>
              <div className="center">
              <button
              
                type="submit"
               
                className="btn btn-primary ml-5"
                
              >
                Withdraw
              </button>
              </div>
            </form>
          </div>
         
        </Card> 
          </Modal>
        //END OF POPUP MODAL TO WITHDRAW ETH

}
<Card border="dark" style={{ width: '30rem', height: '13rem'} }>
    <Card.Body>
    <Row>
      <Col sm={7}>
        <h4 className="pt-4 ">SFP Balance</h4>
      <h4>0.001 SFP</h4>
       </Col>
       <Col sm={5}>
           <h4 className="pt-4 ">$184.00</h4>
           <div border="dark"  className= "box color" style={{ width: '6rem', height: '2.5rem'}} >4.5%</div>
       </Col>
    </Row>
    <div className="pt-3 mt-2">
      <Button variant="outline-dark" style={{ width: '8rem'} } className=" mx-4" >Deposit</Button>{' '}
      <Button variant="outline-dark" style={{ width: '8rem'} }>Withdraw</Button>
     </div>  
    </Card.Body>
</Card>

 <br/>
<div>
   <Card border="dark" style={{ width: '30rem', height: '13rem'} }>
    
    <Card.Body>
    <Row>
      <Col sm={7}>
        <h4 className="pt-4 ">DAI Balance</h4>
      <h4>0.001 DAI</h4>
       </Col>
       <Col sm={5}>
           <h4 className="pt-4 ">$184.00</h4>
           <div border="dark"  className= "box color1" style={{ width: '6rem', height: '2.5rem'}} >4.5%</div>
       </Col>
    </Row>
    <div className="pt-3 mt-2">
      <Button variant="outline-dark" style={{ width: '8rem'} } className=" mx-4" 
      onClick={()=> {this.setState({daiDepo: true})}}>Deposit</Button>{' '}
      <Button variant="outline-dark" style={{ width: '8rem'} }
      onClick={()=> {this.setState({daiDepo: true})}}>Withdraw</Button>
     </div>
      
        
    </Card.Body>
  </Card>
<div/>

<>{
  //POP UP MODAL TO DEPOSIT DAI
  <Modal isOpen={this.state.daiDepo}
  onRequestClose={()=>{this.setState({daiDepo: false})}} className="modal-popup">
   <Card border="dark" style={{ width: '30rem', height: '13rem',top:'2' } } ClassName='mb-5'>
          <div class="form-card">
            <h4 class="text-center mb-4 mt-3">DEPOSIT DAI</h4>
            <form class="form-inline" onSubmit={this.depositEther}>
              <div class="form-group mx-sm-3 mb-2">
                <label htmlFor="deposit" class="sr-only">
                  DAI
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="deposit"
                  placeholder="Amount in DAI"
                  name= "daiDepoAmount"
                  value={this.state.daiDepoAmount}
                  onChange= {this.handleUserInput}
                 
                />
              </div>
              <div class="form-group mx-sm-3 mb-2">
                <label htmlFor="address" class="sr-only">
                  DAI
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  placeholder="Backup Address"
                  name= "backUpAddress"
                  value={this.state.backUpAddress}
                  onChange= {this.handleUserInput}
                
                />
              </div>
              <div className="center">
              <button
              
                type="submit"
               
                className="btn btn-primary ml-5"
                
              >
                Deposit
              </button>
              </div>
            </form>
          </div>
         
        </Card> 
      </Modal>
      //END OF POP UP MODAL TO DEPOSIT DAI

       
}
</>

{
  // POP UP MODAL TO WITHDRAW DAI
  <Modal isOpen={this.state.daiWithdraw}
  onRequestClose={()=>{this.setState({daiWithdraw: false})}} className="modal-popup"> 
 <Card border="dark" style={{ width: '30rem', height: '13rem',top:'2' } } ClassName='mb-5'>
          <div class="form-card">
            <h4 class="text-center mb-4 mt-3">Withdraw DAI</h4>
            <form class="form-inline" onSubmit={this.withdrawEther}>
              <div class="form-group mx-sm-3 mb-2">
                <label htmlFor="deposit" class="sr-only">
                  DAI
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="deposit"
                  placeholder="Amount in DAI"
                  name= "daiWithdrawAmount"
                  value={this.state.daiWithdrawAmount}
                  onChange= {this.handleUserInput}
                 
                />
              </div>
              <div className="center">
              <button
              
                type="submit"
               
                className="btn btn-primary ml-5"
                
              >
                Withdraw
              </button>
              </div>
            </form>
          </div>
         
        </Card> 
          </Modal>
        //END OF POPUP MODAL TO WITHDRAW DAI

}


  <br />
 </div>
 </Col>  
 
 
  
    <Col sm={5}>
       <Card border="dark" style={{ width: '25rem', height: '13rem'} }>
         <Card.Body>
         <div className="pt-5">
           <h4 className="head">Your Balance</h4>
           <h4 className="head pt-2">$1234.00</h4>
          </div>
         </Card.Body>
       </Card>

       <br /> 

       <Card border="dark" style={{ width: '25rem', height: '13rem'} }>
         <Card.Body>
         <div className="pt-5">
           <h4 className="head">Back-up Address</h4>
           <h4 className="head pt-2">$1234.00</h4>
          </div>
          <div>
            <Card.Link eventKey="link-2" className="pt-4 position">Edit</Card.Link>
          </div>
         </Card.Body>
       </Card>

       <br/>
        <Card border="dark" style={{ width: '25rem', height: '13rem'} }>
         <Card.Body>
         <div className="pt-5">
           <h4 className="head">Ping Countdown</h4>
           <h4 className="head pt-2">{this.state.lastPing}</h4>
          </div>
          <div>
            <button border="dark pt-4"  className= "box position " style={{ width: '6rem', height: '2.5rem' }}
            onClick={this.pingHandler} >Ping</button>
          </div>
          <br />
         </Card.Body>
       </Card>
    </Col>

    
  </Row>
</Container>

    



     
      
       


</div> 
 );
}
}

export default App;
