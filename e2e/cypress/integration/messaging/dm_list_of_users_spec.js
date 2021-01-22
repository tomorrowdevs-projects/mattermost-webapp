// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// [#] indicates a test step (e.g. # Go to a page)
// [*] indicates an assertion (e.g. * Check the title)
// Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @messaging

describe('Messaging', () => {
    let testTeam;
    let testUser;

    before(() => {
        cy.apiInitSetup().then(({team, user}) => {
            testTeam = team;
            testUser = user;
        });
    });

    beforeEach(() => {
        cy.apiAdminLogin();
    });

    it('MM-T1665_1 Deactivated user is not shown in Direct Messages modal when no previous conversation', () => {
        // # Create new user, add to team and then deactivate
        cy.apiCreateUser().then(({user: deactivatedUser}) => {
            cy.apiAddUserToTeam(testTeam.id, deactivatedUser.id);
            cy.externalActivateUser(deactivatedUser.id, false);

            // # Login as test user and visit town-square
            cy.apiLogin(testUser);
            cy.visitAndWait(`/${testTeam.name}/channels/town-square`);

            // # Click on '+' sign to open DM modal
            cy.findByLabelText('write a direct message').should('be.visible').click();

            // * Verify that the DM modal is open
            cy.get('#moreDmModal').should('be.visible').contains('Direct Messages');

            // # Search for the deactivated user
            cy.get('#selectItems input').should('be.focused').type(deactivatedUser.email, {force: true});

            // * Verify that the inactive user is not found
            cy.get('#moreDmModal .no-channel-message').should('be.visible').and('contain', 'No items found');
        });
    });

    it('MM-T1665_2 Deactivated user is shown in Direct Messages modal when had previous conversation', () => {
        // # Create new user and then deactivate
        cy.apiCreateUser().then(({user: deactivatedUser}) => {
            cy.apiAddUserToTeam(testTeam.id, deactivatedUser.id);

            // # Login as test user and visit town-square
            cy.apiLogin(testUser);
            cy.visitAndWait(`/${testTeam.name}/messages/@${deactivatedUser.username}`);

            // # Post first message in case it is a new Channel
            cy.postMessage(`Hello ${deactivatedUser.username}`);

            cy.externalActivateUser(deactivatedUser.id, false);

            // # Click on '+' sign to open DM modal
            cy.findByLabelText('write a direct message').should('be.visible').click();

            // * Verify that the DM modal is open
            cy.get('#moreDmModal').should('be.visible').contains('Direct Messages');

            // # Search for the deactivated user
            cy.get('#selectItems input').should('be.focused').type(deactivatedUser.email, {force: true});

            // * Verify that the deactivated user is found
            cy.get('#moreDmModal .more-modal__row--selected').should('be.visible').
                and('contain', deactivatedUser.username).
                and('contain', 'Deactivated');
        });
    });
});
