import PropTypes from 'prop-types';

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

export default class PostImageEmbed extends React.Component {
    constructor(props) {
        super(props);

        this.handleLoadComplete = this.handleLoadComplete.bind(this);
        this.handleLoadError = this.handleLoadError.bind(this);

        this.state = {
            loaded: false,
            errored: false
        };
    }

    componentWillMount() {
        this.loadImg(this.props.link);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.link !== this.props.link) {
            this.setState({
                loaded: false,
                errored: false
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.loaded && this.props.childComponentDidUpdateFunction) {
            this.props.childComponentDidUpdateFunction();
        }
        if (!this.state.loaded && prevProps.link !== this.props.link) {
            this.loadImg(this.props.link);
        }
    }

    loadImg(src) {
        const img = new Image();
        img.onload = this.handleLoadComplete;
        img.onerror = this.handleLoadError;
        img.src = src;
    }

    handleLoadComplete() {
        this.setState({
            loaded: true,
            errored: false
        });
        if (this.props.onLinkLoaded) {
            this.props.onLinkLoaded();
        }
    }

    handleLoadError() {
        this.setState({
            errored: true,
            loaded: true
        });
        if (this.props.onLinkLoadError) {
            this.props.onLinkLoadError();
        }
    }

    render() {
        if (this.state.errored || !this.state.loaded) {
            return null;
        }

        return (
            <div
                className='post__embed-container'
            >
                <img
                    className='img-div'
                    src={this.props.link}
                />
            </div>
        );
    }
}

PostImageEmbed.propTypes = {
    link: PropTypes.string.isRequired,
    onLinkLoadError: PropTypes.func,
    onLinkLoaded: PropTypes.func,
    childComponentDidUpdateFunction: PropTypes.func
};
