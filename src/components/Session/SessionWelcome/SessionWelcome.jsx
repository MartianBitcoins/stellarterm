import React from 'react';
import PropTypes from 'prop-types';
import Generic from '../../Generic';
import Driver from '../../../lib/Driver';

export default function SessionWelcome(props) {
    const d = props.d;
    let currentVoteNote = '';

    if (d.session.account.inflation_destination) {
        currentVoteNote = ' This will overwrite your current inflation destination vote.';
    }
    return (
        <Generic>
            <h2 className="WelcomeTitle">Welcome to BitgamePro!</h2>
            <p>
                Please make sure you have keys securely backed up. Never share your secret key or recovery phrase with
                anyone.
            </p>
            <div className="Generic__divider" />
            <div className="Session__inflation">
                BitgamePro is free open source software. BitgamePro does not ask for donations, but instead, asks for
                inflation votes. The Stellar network rewards accounts that receive many votes through an {'"'}
                <a
                    href="https://www.stellar.org/developers/guides/concepts/inflation.html"
                    target="_blank"
                    rel="nofollow noopener noreferrer">
                    inflation system
                </a>
                {'"'}. It is free to vote for BitgamePro and only requires a vote transaction (0.00001 XLM). Note:
                other wallets may do this without your permission, so if you use another wallet and they tamper with
                your account, this message may show up again.
                <br />
                <br />
                By pressing {'"Accept and Continue"'}, your account will vote for the BitgamePro inflation account.
                Thank you for your support!{currentVoteNote}
                <div className="Inflation_next_block">
                    <a className="Inflation_noThanks" onClick={d.session.handlers.noThanks}>
                        No thanks
                    </a>
                    <button className="s-button" onClick={d.session.handlers.voteContinue}>
                        Accept and Continue
                    </button>
                </div>
            </div>
        </Generic>
    );
}

SessionWelcome.propTypes = {
    d: PropTypes.instanceOf(Driver).isRequired,
};
