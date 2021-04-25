context('Signup flow - happy path', () => {
  const name = 'Lebron James';
  const email = 'TheKing@example.com';
  const password = 'bronny';
  
  it('Successfully signs up', () => {
    cy.visit('localhost:3000');
    cy.get('button[id=register]')
    .click()

    cy.get('input[name=name]')
      .focus()
      .type(name);
    
    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password]')
      .focus()
      .type(password);
 
    cy.get('input[name=email]').then(el => {
      expect(el.val()).to.contain(email);
    });

    cy.get('button[type=submit]')
      .click()
  });

  it('Successfully creates a new game', () => {
    const quizName = "COMP6080 Finals";
    cy.get('input[id=newGameName]')
      .focus()
      .type(quizName);

    cy.get('button[id=newGame]')
      .click()

    cy.get('[id=quiz]').then(q => {
      expect(q.to.contain('Quiz Name: ' + quizName))
    })
  })

  it('Starts game successfully', () => {
    cy.get('button[id=start')
      .click()
    cy.server()
    cy.route('POST', '/admin/quiz/{quizid}/start')
  })

  it('Ends game successfully', () => {
    cy.get('button[id=end')
      .click()
    cy.server()
    cy.route('POST', '/admin/quiz/{quizid}/end')
  })

  it('Loads results page', () => {
    cy.visit(`localhost:3000/quiz/${quizID}/end`)
  })

  it('Logs out of the application successfully', () => {
    cy.visit(`localhost:3000/dashboard`)
    cy.get('button[id=logOut]')
      .click()
  })

  it('Logs back into the application successfully', () => {
    cy.get('input[id=email]')
      .focus()
      .type(email);

    cy.get('input[id=password]')
      .focus()
      .type(password);

    cy.get('button[id=submit]')
      .click()
  })
});
