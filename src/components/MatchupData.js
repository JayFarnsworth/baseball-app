import React, { Component } from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { runInThisContext } from 'vm';

// const FormatStat = ({ stat }) => <h2 className={(stat >= 0) ? 'green' : 'red'}>{(stat >= 0) ? '+' : ''}{stat}% vs {pitcherLast}</h2>

export class MatchupData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchupData: {
        AB: 0, PA: 0, H: 0, HR: 0, RBI: 0, SO: 0, SLG: 0, OPS: 0, OBP: 0, BB: 0, BA: 0, '2B': 0, '3B': 0, BA: 0, 'BB': 0
      }, pitcherData: {
        AB: 0, PA: 0, H: 0, HR: 0, RBI: 0, SO: 0, SLG: 0, OPS: 0, OBP: 0, BB: 0, BA: 0, '2B': 0, '3B': 0, 'BF': 0, 'BB': 0
      }, batterData: {
        AB: 0, PA: 0, H: 0, HR: 0, RBI: 0, SO: 0, SLG: 0, OPS: 0, OBP: 0, BB: 0, BA: 0, '2B': 0, '3B': 0, 'BB': 0, 'BA': 0
      },
      dataLoaded: 0,
      showData: false
    }
  }
  scrapeData = (props) => {
    var pitcherId = this.props.selectedPitcher.player.urlId;
    var batterId = this.props.selectedBatter.player.urlId;
    if (pitcherId == "") {
      let first = this.props.selectedPitcher.player.FirstName;
      let last = this.props.selectedPitcher.player.LastName;
      pitcherId = this.getUrlName(last, first);
    }
    if (batterId == "") {
      let first = this.props.selectedBatter.player.FirstName;
      let last = this.props.selectedBatter.player.LastName;
      batterId = this.getUrlName(last, first);
    }
    console.log(batterId, pitcherId)
    fetch('https://baseball-server.herokuapp.com/scrape?batter=' + batterId + '&pitcher=' + pitcherId)
      .then(resp=>resp.json())
      .then(resp=>{
        var matchupData = resp[0].filter(year => {
          if (year.Year == "RegSeason") return year;
        })
        if (matchupData.length > 0) {
          console.log('hello')
          this.setState({ matchupData: matchupData[0] })
        } 
        let count = this.state.dataLoaded;
        count++
        this.setState({dataLoaded: count})
      });
    fetch('https://baseball-server.herokuapp.com/scrapepitcher?pitcher=' + pitcherId)
      .then(resp => resp.json())
      .then(resp => {
        var pitcherData = resp[0].filter(year => {
          if (year.Year.includes('2017')) return year;
        });
        if (pitcherData.length > 1) {
          pitcherData = pitcherData[pitcherData.length - 1];
        } else {
          pitcherData = pitcherData[0]
        }
        this.setState({ pitcherData: pitcherData })
        let count = this.state.dataLoaded;
        count++
        this.setState({ dataLoaded: count })
      })
    fetch('https://baseball-server.herokuapp.com/scrapebatter?batter=' + batterId)
      .then(resp => resp.json())
      .then(resp => {
        var batterData = resp[0].filter(year => {
          if (year.Year.includes('2017')) return year;
        });
        if (batterData[0].AB !== '') this.setState({ batterData: batterData[0] })
        let count = this.state.dataLoaded;
        count++
        this.setState({ dataLoaded: count })
      })
    var show = this.state.showData;
    this.setState({showData: !show})
  }
  getColorPercent(percent){
    var color;
    if (percent < -100) color = '#800000';
    if (percent > -100 && percent <= -50) color = '#990000';
    if (percent > -50 && percent <= 0) color = '#b30000';
    if (percent < 0 && percent >= 50) color = '#009900';
    if (percent < 50 && percent >= 100) color = '#008000';
    if (percent > 100) color = '#006600';
    return color;
  }
  getUrlName(lName, fName){
      let last = lName.split('');
      let first = fName.split('');
      last.splice(5)
      first.splice(2)
      last.push(first[0])
      last.push(first[1])
      let a = last.join('')
      a = a + '01';
      a = a.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      a = a.toLowerCase();
      return a
  }
  
  

  render() {
    // names
    var batter = this.props.selectedBatter;
    var batterName = batter.player.FirstName + ' ' + batter.player.LastName;
    var batterLast = batter.player.LastName;
    var pitcher = this.props.selectedPitcher;
    var pitcherName = pitcher.player.FirstName + ' ' + pitcher.player.LastName;
    var pitcherLast = pitcher.player.LastName;
    var matchup = batterLast + ' vs ' + pitcherLast;

    // colors
    var pitcherColor = this.props.pitcherColor.colors.primary;
    var batterColor = this.props.batterColor.colors.primary;
    var batterBorder = {
      border: '5px solid ' + `${batterColor}`,
    }
    var pitcherBorder = {
      border: '5px solid ' + `${pitcherColor}`,
    }


   
    var mD = this.state.matchupData;
    var bD = this.state.batterData;
    var pD = this.state.pitcherData;
    // var soP = Number(mD.SO) / Number(mD.AB);
    
    // average 
    console.log(mD)
    var avgComparison = (((mD.BA - (pD.H / (pD.BF - pD.BB))).toFixed(3)));
    var batterComparison = (((mD.BA - bD.BA).toFixed(3)));
    var batterAvg = (bD.BA);
    var pitcherAvg = (pD.H / (pD.BF - pD.BB)).toFixed(3).replace(/^[0]+/g, "");
    var matchupComparison = mD.BA - pitcherAvg;
    var avgCompPer = (((matchupComparison) / pitcherAvg) * 100).toFixed(2) ;
    var batterCompPer = ((batterComparison / pitcherAvg) * 100).toFixed(2);

    // home runs 
    var matchupHrPercent = ((mD.HR / mD.AB) * 100).toFixed(1);
    var batterHrPercent = ((bD.HR / bD.AB) * 100).toFixed(1);
    var batterHrDifference = (((matchupHrPercent - batterHrPercent) / batterHrPercent) * 100).toFixed(1);
    var pitcherHrPercent = ((pD.HR / (pD.BF - pD.BB)) * 100).toFixed(1)
    var hrPercentDifference = (((matchupHrPercent - pitcherHrPercent) / pitcherHrPercent) * 100).toFixed(1);

    // strike outs
    var matchupSoPercent = ((mD.SO / mD.AB) * 100).toFixed(1);
    var batterSoPercent = ((bD.SO / bD.AB) * 100).toFixed(1);
    var pitcherSoPercent = ((pD.SO / (pD.BF - pD.BB)) * 100).toFixed(1);
    var matchupSoDifference = (((matchupSoPercent - pitcherSoPercent) / pitcherSoPercent) * 100).toFixed(0);
    var batterSoDifference = (((matchupSoPercent - batterSoPercent) / batterSoPercent) * 100).toFixed(0);

    // graph positive or negative colors
    if (avgComparison >= 0) {
      var avgColor = 'green';
    } else var avgColor = 'rgb(179, 0, 0)';
    if (hrPercentDifference >= 0) {
      var hrColor = 'green';
    } else var hrColor = 'rgb(179, 0, 0)';
    if (matchupSoDifference <= 0) {
      var soColor = 'green';
    } else var soColor = 'rgb(179, 0, 0)';
    var avgBorder = {
      border: '5px solid ' + avgColor,
    };
    var hrBorder = {
      border: '5px solid ' + hrColor,
    };    
    var soBorder = {
      border: '5px solid ' + soColor,
    };
    console.log('colors', avgColor, hrColor, soColor)

  
    const average = {
      columns: [
        ['Matchup', mD.BA],
        [`${pitcherLast}`, pitcherAvg],
        [`${batterLast}`, batterAvg]
      ],
      type: 'bar',
      groups: [['avg comp', 'P vs MLB']],
      axis: {
        rotated: false,
        y: {
          label: {
            text: 'Batting Average',
            position: 'inner-top',
          }
        },
        x: {
        }
      },
      order: null,
      color: {
        pattern: [avgColor, pitcherColor, batterColor]
      },
      labels: true,
      grid: {
        y: {
          show: true,
          lines: [{value: pitcherAvg}]
        },
        x: {
          show: true
        }
      },
      size: {
        height: '300',
        width: '300'
      },
      bar: {
        width: '10'
      },
      title: {
        text: 'Batting Average'
      },
      tooltip: {
        title: {
          text: 'Batting Average'
        }
      }
    };


    const homeRuns = {
      columns: [
        ['Matchup', (mD.HR / mD.AB).toFixed(3)],
        [`${pitcherLast}`, (pD.HR / (pD.BF - pD.BB)).toFixed(3)],
        [`${batterLast}`, (bD.HR / bD.AB).toFixed(3)]
      ],
      type: 'bar',
      groups: [['avg comp', 'P vs MLB']],
      axis: {
        rotated: false,
        y: {
          label: {
            text: 'Batting Average',
            position: 'inner-top',
          }
        },
        x: {
        }
      },
      order: null,
      color: {
        pattern: [hrColor, pitcherColor, batterColor]
      },
      labels: true,
      grid: {
        y: {
          show: true
        },
        x: {
          show: true,
        }
      },
      size: {
        height: '300',
        width: '300'
      },
      bar: {
        width: '10'
      },
      title: {
        text: 'Home Runs Per AB'
      }
    };

    const soPercent = {
      columns: [
        ['Matchup', (mD.SO / mD.PA).toFixed(3)],
        [`${pitcherLast}`, (pD.SO / pD.BF).toFixed(3)],
        [`${batterLast}`, (bD.SO / bD.PA).toFixed(3)]
      ],
      type: 'bar',
      groups: [['avg comp', 'P vs MLB']],
      axis: {
        rotated: false,
        y: {
          label: {
            text: 'Batting Average',
            position: 'inner-top',
          }
        },
        x: {
        }
      },
      order: null,
      color: {
        pattern: [soColor, pitcherColor, batterColor]
      },
      labels: true,
      grid: {
        y: {
          show: true
        },
        x: {
          show: true,
        }
      },
      size: {
        height: '300',
        width: '300'
      },
      bar: {
        width: '10'
      },
      title: {
        text: 'Strike Outs Per At Bat'
      }
    };


    return (

      <div>
        <button onClick={this.scrapeData} id='matchup-button'>See Matchup</button>
        <div className={(this.state.dataLoaded === 3) ? '' : 'hide'}>
        <h2 id='matchup-names'>{batterName} vs. {pitcherName}</h2>
        <div id='data-box'>
        {(mD.PA == 0) ? <h3>No Matchup Data</h3> : 
          <div id='number-stats'>
            <h3>{mD.H} / {mD.AB}</h3>
            <h3 className={(avgComparison >= 0) ? 'green' : 'red'}>{mD.BA} AVG</h3>
            <h3>{mD.OBP} OBP</h3>
            <h3 className={(hrPercentDifference >= 0) ? 'green' : 'red'}>{mD.HR} HR</h3>
            <h3>{mD.RBI} RBI</h3>
            <h3>{mD.BB} BB</h3>
            <h3 className={(matchupSoDifference >= 0) ? 'red' : 'green'}>{mD.SO} SO</h3>
          </div> }
          {(this.state.dataLoaded !== 3) ? '' : 
          <div id='chart-box'>
            <h3 className='chart-title'>Batting Average</h3>
            <div className='graph-box'>
              <div className='chart-box'>
                <C3Chart data={average} axis={average.axis} color={average.color} grid={average.grid} groups={average.groups} size={average.size} bar={average.bar} order={average.order} title={average.title} tooltip={average.tooltip}/>
              </div>
              <div className='stats-above left-box'>
                <div className='matchup-comp-box left-box' style={avgBorder}>
                  <h2>{batterLast} vs {pitcherLast}:</h2>
                  <div className='matchup-avg'>
                    <h2>{mD.H} / {mD.AB}</h2>
                    <h2 className={(avgComparison >= 0) ? 'green' : 'red' }>{mD.BA} BA</h2>
                  </div>
                  <h2 id='avg-comparison' className={(avgComparison >= 0) ? 'green' : 'red'}>{(avgComparison >= 0) ? '+' : ''} {avgCompPer} %</h2>
                </div>
                <div className='pitcher-stat left-box' style={pitcherBorder}>
                  <h2>{pitcher.player.LastName} {pitcherAvg} Opp. BA (2017)</h2>
                  <h2 className={(avgComparison >= 0) ? 'green' : 'red'}>{(avgComparison >= 0) ? '+' : ''} {avgCompPer}% vs {pitcherLast}</h2>
                </div>
                <div className='batter-stat left-box' style={batterBorder}>
                  <h2>{batter.player.LastName} {batterAvg} BA (2017)</h2>
                  <h2 className={(batterCompPer >= 0) ? 'green' : 'red'}>{(batterCompPer >= 0) ? '+' : ''}{batterCompPer}% vs {pitcherLast}</h2>
                </div>
              </div>

            </div>
            <h3 className='chart-title'>Home Runs Per At Bat</h3>
            <div className='graph-box'>
              <div className='chart-box'>
                <C3Chart data={homeRuns} axis={homeRuns.axis} color={homeRuns.color} size={homeRuns.size} bar={homeRuns.bar} title={homeRuns.title} grid={homeRuns.grid}/>
              </div>

              <div className='stats-above left-box'>
                <div className='matchup-comp-box left-box' style={hrBorder}>
                  <h2>{batterLast} vs {pitcherLast}</h2>
                  <div className='matchup-avg'>
                    <h2>{mD.HR}/{mD.AB}</h2>
                    <h2 className={(hrPercentDifference >= 0) ? 'green' : 'red'}>HR in {matchupHrPercent}% of ABs</h2>
                  </div>
                  <h2 className={(hrPercentDifference > 0) ? 'green' : 'red'}>{(hrPercentDifference > 0) ? '+' : ''}{hrPercentDifference}% </h2>
                </div>
                  <div className='pitcher-stat left-box' style={pitcherBorder}>
                    <h2>{pitcherLast} {pitcherHrPercent}% HR Rate (2017)</h2>
                    <h2 className={(hrPercentDifference >= 0) ? 'green' : 'red'}>{(hrPercentDifference > 0) ? '+' : ''}{hrPercentDifference}% vs {batterLast}</h2>
                  </div>
                  <div className='batter-stat left-box' style={batterBorder}>
                    <h2>{batterLast} {batterHrPercent}% HR Rate (2017)</h2>
                    <h2 className={(batterHrDifference >= 0) ? 'green' : 'red'}>{(batterHrDifference > 0) ? '+' : ''}{batterHrDifference}% vs {pitcherLast}</h2>
                  </div>
                </div>

            
            </div>
            <h3 className='chart-title'>Strike Out Percentage</h3>
            <div className='graph-box'>
              <div className='chart-box'>
                <C3Chart data={soPercent} axis={soPercent.axis} color={soPercent.color} size={soPercent.size} bar={soPercent.bar} title={soPercent.title} grid={homeRuns.grid}/>     
              </div>
              <div className='stats-above left-box'>
                <div className='matchup-comp-box left-box' style={soBorder}>
                <h2>{batterLast} vs {pitcherLast}</h2>
                <div className='matchup-avg'>
                  <h2>{mD.SO}/{mD.AB} SO/AB</h2>
                  <h2 className={(matchupSoDifference >= 0) ? 'red' : 'green'}>{matchupSoPercent}% SO Rate</h2>
                </div>
                  <h2 className={(matchupSoDifference >= 0) ? 'red' : 'green'}>{(matchupSoDifference > 0) ? '+' : ''}{matchupSoDifference}%</h2>
                </div>
                <div className='pitcher-stat left-box' style={pitcherBorder}>
                  <h2>{pitcherLast} (2017): {pitcherSoPercent}% SO Rate</h2>
                  <h2 className={(matchupSoDifference >= 0) ? 'red' : 'green'}>{(matchupSoDifference > 0) ? '+' : ''}{matchupSoDifference}% vs {batterLast}</h2>
                </div>
                <div className='batter-stat left-box' style={batterBorder}>
                  <h2>{batterLast} (2017): {batterSoPercent}% SO Rate</h2>
                  <h2 className={(batterSoDifference >= 0) ? 'red' : 'green'}>{(batterSoDifference > 0) ? '+' : ''}{batterSoDifference}% vs {pitcherLast}</h2>
                </div>
              </div>
            </div>

          </div>}
        </div>
        </div>
      </div>
    );

  }
}
export default MatchupData;