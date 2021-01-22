// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';

import {savePreferences} from 'mattermost-redux/actions/preferences';
import {Preferences} from 'mattermost-redux/constants';
import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {get as getPreference, getSidebarPreferences} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'mattermost-redux/types/store';

import UserSettingsSidebar from './user_settings_sidebar';

function mapStateToProps(state: GlobalState) {
    const config: any = getConfig(state);

    const closeUnusedDirectMessages = getPreference(
        state,
        Preferences.CATEGORY_SIDEBAR_SETTINGS,
        'close_unused_direct_messages',
        'after_seven_days',
    );

    const channelSwitcherOption = getPreference(
        state,
        Preferences.CATEGORY_SIDEBAR_SETTINGS,
        'channel_switcher_section',
        'true',
    );

    const sidebarPreference = getSidebarPreferences(state);

    return {
        closeUnusedDirectMessages,
        sidebarPreference,
        unreadsAtTop: sidebarPreference.unreads_at_top,
        favoriteAtTop: sidebarPreference.favorite_at_top,
        channelSwitcherOption,
        showChannelOrganization: config.ExperimentalChannelOrganization === 'true',
        showUnusedOption: config.CloseUnusedDirectMessages === 'true',
        user: getCurrentUser(state),
        enableLegacySidebar: config.EnableLegacySidebar === 'true',
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        actions: bindActionCreators({
            savePreferences,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsSidebar);
