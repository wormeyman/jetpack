/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import DashItem from 'components/dash-item';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import QueryVaultPressData from 'components/data/query-vaultpress-data';
import {
	isModuleActivated as _isModuleActivated,
	activateModule,
	isFetchingModulesList as _isFetchingModulesList
} from 'state/modules';
import { getSitePlan } from 'state/site';
import {
	isPluginActive,
	isPluginInstalled
} from 'state/site/plugins';
import {
	getVaultPressData as _getVaultPressData
} from 'state/at-a-glance';
import { isDevMode } from 'state/connection';

const DashBackups = React.createClass( {
	getContent: function() {
		const labelName = __( 'Site Backups %(vaultpress)s', { args: { vaultpress: '(VaultPress)' } } ),
			hasSitePlan = false !== this.props.getSitePlan();

		if ( this.props.isModuleActivated( 'vaultpress' ) ) {
			const vpData = this.props.getVaultPressData();

			if ( vpData === 'N/A' ) {
				return(
					<DashItem
						label={ labelName }
						pro={ true }
					>
						<p className="jp-dash-item__description">{ __( 'Loading…' ) }</p>
					</DashItem>
				);
			}

			if ( vpData.code === 'success' ) {
				return(
					<DashItem
						label={ labelName }
						status="is-working"
						className="jp-dash-item__is-active"
						pro={ true }
					>

						<p className="jp-dash-item__description">
							{ vpData.message }
							<br/>
							{ __( '{{a}}View backup details{{/a}}', {
								components: {
									a: <a href='https://dashboard.vaultpress.com' target="_blank" />
								}
							} ) }
						</p>
					</DashItem>
				);
			}
		}

		if ( ! hasSitePlan ) {
			return(
				<DashItem
					label={ labelName }
					className="jp-dash-item__is-inactive"
					status="pro-inactive"
					pro={ true }
				>
					<p className="jp-dash-item__description">
						{
							isDevMode( this.props ) ? __( 'Unavailable in Dev Mode.' ) :
								__( 'To automatically back up your site, please {{a}}upgrade!{{/a}}', {
									components: {
										a: <a href={ 'https://wordpress.com/plans/' + window.Initial_State.rawUrl } target="_blank" />
									}
								} )
						}
					</p>
				</DashItem>
			);
		} else {
			return(
				<DashItem
					label={ labelName }
					className="jp-dash-item__is-inactive"
					status="pro-inactive"
					pro={ true }
				>
					<p className="jp-dash-item__description">
						{
							isDevMode( this.props ) ? __( 'Unavailable in Dev Mode.' ) :
								__( 'To automatically back up your site, please {{a}}install and activate{{/a}} VaultPress', {
									components: {
										a: <a href='https://wordpress.com/plugins/vaultpress' target="_blank" />
									}
								} )
						}
					</p>
				</DashItem>
			);
		}
	},

	render: function() {
		return(
			<div>
				<QueryVaultPressData />
				{ this.getContent() }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			isModuleActivated: ( module_name ) => _isModuleActivated( state, module_name ),
			isFetchingModulesList: () => _isFetchingModulesList( state ),
			getVaultPressData: () => _getVaultPressData( state ),
			isPluginActive: ( plugin_slug ) => isPluginActive( state, plugin_slug ),
			isPluginInstalled: ( plugin_slug ) => isPluginInstalled( state, plugin_slug ),
			getSitePlan: () => getSitePlan( state )
		};
	},
	( dispatch ) => {
		return {
			activateModule: ( slug ) => {
				return dispatch( activateModule( slug ) );
			}
		};
	}
)( DashBackups );
