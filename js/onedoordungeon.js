function Button(props) {
	return (
  	<div>
    	<button onClick={props.clickHandler} >{props.name}</button>
    </div>
  );
}

function Seed(props) {
	return (
  	<div className="container">
    	<div className="row">
      	Seed: &nbsp;
    		<button onClick={props.onDecrement} disabled={props.seed === 0}>-</button>
    		<input type="text" value={props.seed} onChange={(e) => props.handleChange(parseInt(e.target.value))} />
        <button onClick={props.onIncrement} disabled={props.seed === (props.maxSeed - 1)}>+</button>
        <span> of {props.maxSeed - 1 }</span>
      </div>
      <div>
      	<button onClick={props.onRandom}>Random</button>
      </div>
    </div>
  );
}

function Output(props) {
	return (
  <div>
  	<span>{props.output}</span>
    </div>
  )
}

function Descriptors(props) {
	return (
  	<div className="form-group row">
    {props.xyz.map((item, index) => {
    	return(
      	<div className="col-xs-3">
        	<textarea className="form-control"
        					rows={item.value.length}
                  key={index}
                  value={item.value.join("\n")}
                  onChange={(e) => props.handleChange(e.target.value,index)}/>
        </div>);
    })}
    
    </div>
  );
}

class App extends React.Component {
constructor(props) {
 super(props);
	this.state = {
  	descriptors: [
    	{value: ["pink", "red", "blue","yellow"], },
      {value: ["walls with"], },
      {value: ["stone", "dirt", "wooden", "mud", "mud and straw", "blood drenched"], },
      {value: ["floors and"], },
      {value: ["1", "2", "4","10","17"], },
      {value: ["orcs", "wyrms", "goblins", "snarks", "wirffals"], },
       
    ],
    seed: 0,
    maxSeed: 1,
    generated: ""
  };
  
  this.state.maxSeed = this.state.descriptors.reduce((a, c) => a * c.value.length, 1);
  }
  
  componentDidMount() {
  	this.onGenerate();
  }
  
  updateSeeds = (descriptors, currentSeed) => {
   		let newMaxSeed = descriptors.reduce((a, c) => a * c.value.length, 1);
      let newSeed = currentSeed;
      
      if (newSeed > newMaxSeed){
        newSeed = newMaxSeed - 1;
      }
      
      return ({
      	maxSeed: newMaxSeed,
      	seed: newSeed,		
      });
  }
  
  onAddDescriptor = () => {
  	this.setState(ps => ({descriptors: ps.descriptors.concat([{value:[]}])}));
  }
  
  onRemoveDescriptor = () => {    
    this.setState(ps => {
    	let newDescriptors = ps.descriptors.slice(0,-1);
      return (Object.assign({
      	descriptors: newDescriptors,
      }, this.updateSeeds(newDescriptors, ps.seed)))
    }, this.onGenerate);
    
  }
  
  updateTSeed = (tseed, adjustment) => {
  	let newSeed = Math.floor(tseed / adjustment);
    return newSeed > -1 ? newSeed : 0
  }
  
  onGenerate = () => {
  	let tSeed = this.state.seed;
    let descriptors = this.state.descriptors;
    let result = [];
    for (let i = 0; i < descriptors.length; i++){
    	
      let d = descriptors[i];
    	let l = descriptors[i].value.length;
      if (l > 0){
    		result.push(d.value[tSeed % l].trim());
      }
      
      tSeed = this.updateTSeed(tSeed,l);
    }
    this.setState({ generated: result.join(" ")});
  }
  
  onSeedIncrement = () => {
  	if (this.state.seed === this.state.maxSeed - 1) return;
    this.setState(ps => ({seed: ps.seed + 1}),
    this.onGenerate);
  }
  
  onSeedDecrement = () => {
  	if (this.state.seed === 0) return;
    this.setState(ps => ({seed: ps.seed - 1}),
    this.onGenerate);
  }
  
  onSeedRandom = () => {
  	this.setState(ps => (
    	{ seed: Math.floor(Math.random() * ps.maxSeed)}
    ), this.onGenerate);
  }
  
  onHandleSeedChange = (x) => {
  	this.setState(ps => {
    	if (isNaN(x) || x < 0 || x > (ps.maxSeed - 1)) return ps;
      return ({seed: x});
    }, this.onGenerate);
    
  	// if (x > -1 && x < this.state.maxSeed) {
  	// 	this.setState({seed: x}, this.onGenerate);
  	// }
  }
  
  onHandleDescriptorChange = (val, i) => {
  	this.setState(prevState => {
    	let newDescriptors = prevState.descriptors.concat([]);
      newDescriptors[i] = { value: val.split("\n") };
      
      return (Object.assign({
      	descriptors: newDescriptors,
       
      }, this.updateSeeds(newDescriptors, prevState.seed)));
    }, this.onGenerate);
  }
  
render () {

	

	return (<div className="container">
  	<label>One Room dungeon</label>
    <div className="row">
    	<Button className="btn" name="Add Descriptor" clickHandler={this.onAddDescriptor} />
      <Button className="btn" name="Remove Descriptor" clickHandler={this.onRemoveDescriptor} />

    	{/* <Button className="btn" name="Generate" clickHandler={this.onGenerate} /> */}
    </div>
    <div>
    	<Seed seed={this.state.seed} 
      				maxSeed={this.state.maxSeed} 
      				handleChange={this.onHandleSeedChange}
              onIncrement={this.onSeedIncrement}
              onDecrement={this.onSeedDecrement} 
              onRandom={this.onSeedRandom} />
    </div>
    <div className="container">
    	Descriptors
    	<Descriptors xyz={this.state.descriptors} handleChange={this.onHandleDescriptorChange} />
      </div>
      <Output output={this.state.generated} />
    </div>
);}
}

ReactDOM.render(<App />, mountNode);







