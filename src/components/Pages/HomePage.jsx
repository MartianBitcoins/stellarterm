import React from 'react';
import PropTypes from 'prop-types';
import Driver from '../../lib/Driver';
import AssetList from '../AssetList';

export default class HomePage extends React.Component {

    renderHomePageActions() {
        const state = this.props.driver.session.state;
        if (state !== 'out') { return ''; }

        const signUpLinkClass = 'HomePage__lead__actions__sign-up-button HomePage__lead__actions__button s-button';
        return (
            <div className="HomePage__lead__actions">
                <a className={signUpLinkClass} href="#signup">Sign Up</a>
                &nbsp;
                <a className="s-button HomePage__lead__actions__button" href="#account">Login</a>
            </div>
        );
    }

    render() {
        return (
            <div>

                <div className="HomePage__black">
                    <div className="so-back">
                        <div className="HomePage__lead">

                            <h2 className="HomePage__lead__title">
                                Trade on the <a href="#exchange">Stellar Decentralized Exchange</a>
                            </h2>

                            <p className="HomePage__lead__summary">
                                BitgamePro is an <a href="https://github.com/stellarterm/stellarterm" target="_blank" rel="nofollow noopener noreferrer">
                                open source</a> client for the <a href="https://www.stellar.org/" target="_blank" rel="nofollow noopener noreferrer">
                                Stellar network</a>.
                                <br />
                                Send, receive, and <a href="#exchange">trade</a> assets on the Stellar
                                network easily with BitgamePro.
                             </p>
                            {this.renderHomePageActions()}
                        </div>
                    </div>
                </div>

                <div className="so-back islandBack HomePage__assetList">
                    <div className="island">
                        <AssetList d={this.props.driver} limit={6} />
                        <div className="AssetListFooter">
                            View more assets on the <a href="#markets">market list page</a>.
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

HomePage.propTypes = {
    driver: PropTypes.instanceOf(Driver).isRequired,
};
