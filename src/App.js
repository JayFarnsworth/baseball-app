import React, { Component } from 'react';
import Header from './components/Header';
import PlayerForms from './components/PlayerForms';
import Matchup from './components/Matchup';
import MatchupData from './components/MatchupData';
import 'c3/c3.css';
import './App.css';
import colors from './assets/teamColors.json';
import C3Chart from 'react-c3js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBat: false,
      showPitch: false,
      selectedPitcher: {
        player: {FirstName: '', LastName: '', officialImageSrc: '', Position: '', urlId: '', handedness: { Bats: ''}, Weight: '', Height: '', Age: '', BirthCity: '', BirthCountry: '' }, team: { Abbreviation: '', City: '', Name: '' } }, 
      selectedBatter: { player: { FirstName: '', LastName: '', officialImageSrc: '', Position: '', urlId:   '', handedness: { Bats: '' }, Weight: '', Height: '', Age: '', BirthCity: '', BirthCountry: '' },   team: { Abbreviation: '', City: '', Name: '' } },
      colors: colors,
      batterColor: '',
      pitcherColor: ''
 
    } 
  }


  searchFilter = (event) => {
    event.preventDefault();
    console.log('hi')
  }
  setSelectedBatter = (batter) => {
    var showBat = this.state.showBat;
    showBat = !showBat;
    this.setState({selectedBatter: batter, showBat: showBat}, ()=>{
      this.getBatterColor(this.state.selectedBatter)
    })
  }
  setSelectedPitcher = (pitcher) => {
    var showPitch = this.state.showPitch;
    showPitch = !showPitch;
    this.setState({selectedPitcher: pitcher, showPitch: showPitch}, ()=>{
      this.getPitcherColor(this.state.selectedPitcher)
    })
  }
  getBatterColor = (player) => {
    let colors = this.state.colors.mlbColors;
    let batter1 = this.state.selectedBatter;
    let color1 = colors.filter(color => {
      return batter1.team.Name == color.name
    })
    this.setState({ batterColor: color1[0] })
  }
  getPitcherColor = (player) => {
    let colors = this.state.colors.mlbColors;
    let pitcher1 = this.state.selectedPitcher;
    var color1 = colors.filter(color => {
      if(pitcher1.team) return pitcher1.team.Name == color.name
    })
    if (color1.length === 0) color1 = [{
      "name": "MLB",
      "colors": {
        "primary": "black",
        "secondary": "gray"
      }
    }]
    this.setState({ pitcherColor: color1[0] })
  }

  render() {


    return (
      <div className="App">
        <Header/>
        <PlayerForms
        searchFilter={this.searchFilter}
        setSelectedBatter={this.setSelectedBatter}
        setSelectedPitcher={this.setSelectedPitcher}
        />
        <Matchup
        colors={this.state.colors}
        showBat={this.state.showBat}
        showPitch={this.state.showPitch}
        selectedBatter={this.state.selectedBatter}
        selectedPitcher={this.state.selectedPitcher}
        batterColor={this.state.batterColor}
        pitcherColor={this.state.pitcherColor}
        />
        {(this.state.pitcherColor !== '' && this.state.batterColor !== '') ? <MatchupData
        {...this.props}
        batterColor={this.state.batterColor}
        pitcherColor={this.state.pitcherColor}
        selectedBatter={this.state.selectedBatter}
        selectedPitcher={this.state.selectedPitcher}
        /> : ''}
      </div>
    );
  }
}
export default App;
