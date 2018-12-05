/*
GIPHY.com
User can create a new account

‘Invalid Email’ error prompt appears if user enters an invalid email during login

As a signed in user, I can search for ‘Canada’ and favourite the #canada image

As a signed in user, I can unfavourite an image from the Favorites Screen
(https://giphy.com/favorites)

Webpage sends ‘is_public’ = false to backend when
toggling from Public to Private channel setting (https://giphy.com/settings)

As a signed in user, I can upload an image and create a new giphy image with ‘FQA test test’ text.

As a signed in user, I can successfully log out
*/

// Generate random integer

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randInt = getRandomInt(1, 6000)

const uploadImg = 'https://www.youtube.com/watch?v=a1Y73sPHKxw'

describe('Assertions', () => {
  it.skip('Invalid Email Test', () => {
    cy.visit('https://giphy.com/')
    cy.get('#login-button').click()
    cy.get(':nth-child(7) > a').click()
    cy.get(`input[type='email']`).type(`shayne+${randInt}!eventbase.com`)
    cy.get(`input[type='username']`).click()
    cy.get('.ss-alert').should('be.visible')
  })

  it('User can create a new acount', () => {
    cy.visit('https://giphy.com/')
    cy.get('#login-button').click()
    cy.get(':nth-child(7) > a').click()
    cy.get(`input[type='email']`).type(`shayne+${randInt}@eventbase.com`)
    cy.get(`input[type='username']`).type(`shayneTest${randInt}`)
    cy.get(`input[type='password']`).type(`TestPassw0rd!`)
    cy.get('button').contains('Sign Up').click()

    // Search for CANADA, Open the first image. Favourite it.
    cy.get(`#search-box`).type('Canada').type('{enter}')
    cy.url().should('eq', 'https://giphy.com/search/Canada')
    cy.get('img[alt="canada GIF"]').first().click()

    // click the favorite button on the gif
    cy.get('._2T3VM71zjFUfWcC0wxlqte > ._3_Iqv2eF8FuK3joSjURmOO').click()

    // View new favourites and unfavourite the Canada gif
    cy.wait(5000)
    cy.visit('https://giphy.com/favorites')

    // put assertion to verify page is not empty
    cy.get('.gif_gifImage__3dFjs').first().click()
    cy.get('._1_cwJiJLy366TYHJ0ZojUn').click()
    // put assertion to verify page is now empty

    // Open Settings
    cy.wait(5000)
    cy.visit('https://giphy.com/settings')
    // Click the PRIVATE button and 'is_public' is false when button is pressed
    cy.get('.toggle-inactive').contains('Private').click()
    cy.request('https://giphy.com/settings')
      .should((response) => {
        expect(response.status).to.eq(200)
        cy.get('input[name="is_public"]').should('have.value', 'false')
      })
  })

  it('Determine image uploader works', () => {
    cy.visit('https://giphy.com/')

    // create button
    cy.get('._23RtopKAI5Hj6SZSgi0wR5').click()
    cy.url().should('eq', 'https://giphy.com/create/gifmaker')

    // upload Youtube link
    cy.get('._35BEC7IGiS5fzfdaPB86jq').click().type(uploadImg)
    cy.url().should('eq', 'https://giphy.com/create/gifmaker/video-trim')

    // begin upload after trim page
    cy.get('._6WZyciPmD3H_QZtPwGaAq').click()
    cy.url().should('eq', 'https://giphy.com/create/gifmaker/decorate/caption')
    cy.wait(5000)

    // close the ribbon
    cy.get('.flash-message__MessageClose-grey4k-3').click()

    // Add caption and confirm upload
    cy.get('._3hPx2FPos5hh7ZJE4tRUkI').click().type('FQA test test')
    cy.wait(5000)
    cy.get(':nth-child(2) > ._6WZyciPmD3H_QZtPwGaAq').click()

    // final upload confirmation
    cy.get('div').contains('Start Over').siblings('div').click()

    // Logout
    cy.wait(7500)
    cy.visit('https://www.giphy.com/logout')
  })
})
