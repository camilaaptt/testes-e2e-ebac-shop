import DetalhesFaturamento from "../support/page_objects/faturamento-checkout.page"
var faker = require('faker-br');
const perfil = require('../fixtures/perfil.json')

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    beforeEach(() => {
        // Acessar Loja EBAC
        cy.visit('minha-conta')
        // Realizar login como cliente
        cy.login(perfil.usuario, perfil.senha)
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        //Escolher 4 produtos e adiciona ao carrinho
        cy.adicionaProduto('Abominable Hoodie', 'L', 'Green', '1')
        cy.adicionaProduto('Abominable Hoodie', 'S', 'Red', '1')
        cy.adicionaProduto('Abominable Hoodie', 'M', 'Blue', '1')
        cy.adicionaProduto('Abominable Hoodie', 'XL', 'Red', '1')
        cy.get('.woocommerce-message > .button').click()
        cy.get('.checkout-button').click()

        // Preencher todas as opções do checkout
        let nomeFaker = faker.name.firstName();
        let sobrenomeFaker = faker.name.lastName();
        let paisFaker = faker.address.country();
        let enderecoFaker = faker.address.streetAddress();
        let numeroFaker = faker.address.secondaryAddress();
        let cidadeFaker = faker.address.city();
        let estadoFaker = faker.address.state();
        let cepFaker = faker.address.zipCode();
        let telefoneFaker = faker.phone.phoneNumber();
        let emailFaker = faker.internet.email(nomeFaker);

        DetalhesFaturamento.editarDetalhesFaturamento(
            nomeFaker,
            sobrenomeFaker,
            paisFaker,
            enderecoFaker,
            numeroFaker,
            cidadeFaker,
            estadoFaker,
            cepFaker,
            telefoneFaker,
            emailFaker
        )

        cy.get('#terms').check()
        cy.get('#place_order').click()

        // Validando a compra
        cy.get('.woocommerce-notice').should('contain', ('Obrigado. Seu pedido foi recebido.'))
    });
})