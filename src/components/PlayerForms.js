import React, {Component} from 'react';
import SearchResults from './SearchResults'

export class PlayerForms extends Component {
  constructor(props){
    super(props);
    this.state = {
      pitchToggle: false,
      batToggle: false,
      players: {},
      batterResults: [],
      pitcherResults: [],
      batterSelection: null,
      pitcherSelection: null,
      batterName: '',
      pitcherName: ''
    }
  }
  componentDidMount() {
    fetch('assets/player_list.json')
      .then(resp=>resp.json())
      .then(resp=>{
        console.log(resp)
        let players = resp.activeplayers.playerentry;
        this.setState({players: players})
      })
  }

  dropDownBat = (event) => {
    event.preventDefault()
    let toggle = !this.state.batToggle;
    this.setState({batToggle: toggle})
  }
  dropDownPitch = (event) => {
    event.preventDefault()
    let toggle = !this.state.pitchToggle;
    this.setState({ pitchToggle: toggle })
  }
  searchFilter = (event) => {
    event.preventDefault()
    var query = event.target.value;
    var list = this.state.players;
    var results = list.filter(player => {
      let position = player.player.Position;
      let first = player.player.FirstName.toLowerCase();
      let last = player.player.LastName.toLowerCase();
      let full = first + ' ' + last;
      if (full.normalize('NFD').includes(query) && position !== 'P') return player
    })
    if (results.length > 10) results.length=10
    this.setState({batterResults: results})
    return results
  }  
  searchFilterPitchers = (event) => {
    event.preventDefault()
    var query = event.target.value;
    var list = this.state.players;
    var results = list.filter(player => {
      var position = player.player.Position;
      let first = player.player.FirstName.toLowerCase();
      let last = player.player.LastName.toLowerCase();
      let full = first + ' ' + last;
      if (full.normalize('NFD').includes(query) && position == 'P') return player
    })
    if (results.length > 10) results.length=10
    this.setState({pitcherResults: results})
    return results
  }
  confirmSearch = (event) => {
    event.preventDefault()
    let id = event.currentTarget.id;
    let players = this.state.players;
    let target = players.filter(player=>{
      if (player.player.ID == id) return player
    })
    target = target[0]
    console.log(target)
    var name = target.player.FirstName + ' ' + target.player.LastName;
    if (target.player.Position == 'P') {
      this.setState({pitcherSelection: target, pitcherName: name})
      this.sendPitcher(target)
      let pitcher = this.state.pitcherSelection
    } else {
      this.setState({batterSelection: target, batterName: name})
      this.sendBatter(target)
    };
  }
  sendBatter = (data) => {
    console.log('set batter')
    this.props.setSelectedBatter(data)
  }
  sendPitcher = (data) => {
    this.props.setSelectedPitcher(data)
  }
  



render(){

  return (
    <div>
      <div id='search-boxes'>
        <form id='batter-form'>
          <input type='text' placeholder='Batter Name' name='batterName'    onClick={this.dropDownBat} autoComplete='off' className='search-input' id='batter-input' onInput={this.searchFilter} />
          <div id='batter-dropdown' onClick={this.dropDownBat} className={'dropdown-content ' + (this.state.batToggle ? 'show' : '')}>
            <SearchResults
            results={this.state.batterResults}
            confirmSearch={this.confirmSearch}
            />
          </div>
        </form>
          <form id='pitcher-form'>
            <input type='text' placeholder='Pitcher Name' name='pitcherName' onClick={this.dropDownPitch} autoComplete='off' className='search-input' id='pitcher-input' onInput={this.searchFilterPitchers}/>
            <div id='pitcher-dropdown' onClick={this.dropDownPitch} className={'dropdown-content ' + (this.state.pitchToggle ? 'show' : '')}>
              <SearchResults
              results={this.state.pitcherResults}
              confirmSearch={this.confirmSearch}
              />

            </div>
          </form>
      </div>
    </div>
  );

}
}
export default PlayerForms;