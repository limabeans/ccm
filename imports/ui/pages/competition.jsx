import React from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';

const Competition = React.createClass({
  componentWillMount() {
    this.props.competitionId = api.competitionUrlIdToId(this.props.competitionUrlId);
    this.props.competition = Competitions.findOne(this.props.competitionId);
  },

  registeredForCompetition: function() {
    let registration = Registrations.findOne({
      competitionId: this.props.competitionId,
      userId: this.props.userId,
    }, {
      fields: { _id: 1 }
    });
    return !!registration;
  },

  competitionIsScheduled: function() {
    return this.props.competition.startDate;
  },

  dateInterval: function() {
    let {competition} = this.props;
    return $.fullCalendar.formatRange(moment(competition.startDate).utc(), moment(competition.endDate()).utc(), "LL");
  },

  render() {
    let {ready, competition, competitionId, competitionUrlId} = this.props;
    if(!ready || !competition) {
      return <div/>;
    }

    let name = competition.competitionName;

    return (
      <div className='container'>
        <h1>{name}</h1>
        <p>
          {this.competitionIsScheduled() ?
            <a href={`${competitionUrlId}/schedule`}>{this.dateInterval()}</a> : 'Unscheduled'
          }
        </p>
      </div>
    );
  }
});

createContainer((props) => {
  let subscription = Meteor.subscribe('competition', props.competitionUrlId);
  let competitionId = api.competitionUrlIdToId(props.competitionUrlId);
  let competition = Competitions.findOne(competitionId);

  return {
    ready: subscription.ready(),
    userId: Meteor.userId(),
    competition: competition,
    competitionId: competitionId,
  };
}, Competition);
