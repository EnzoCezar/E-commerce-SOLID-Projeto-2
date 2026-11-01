# E-commerce SOLID — Projeto 2

## Estrutura de Diretórios

* `src/controllers/`: Camada HTTP. O `OrderController` recebe a requisição, chama o `OrderService` e devolve a resposta.
* `src/domain/`: Regras de negócio puras: produtos (`PhysicalProduct`, `DigitalProduct`), `ProductFactory` e `BusinessError`.
* `src/services/`: `OrderService` (fluxo do pedido) e `NotificationService` (monta o e-mail de confirmação).
* `src/providers/`: Ferramentas externas. `IMailProvider` e `EtherealMailProvider` (Nodemailer).
* `src/repositories/`: Acesso ao banco. Interfaces e implementações com Prisma para pedidos e produtos.
* `src/payments/`: Formas de pagamento (crédito, débito e Pix) e o `PaymentMethodRegistry`.
* `src/lib/logger.ts`: Utilitário de log (Winston - procure mais sobre ele, é muito util em projetos reais).
* `src/app.ts` & `src/server.ts`: Configuração do Express, injeção de dependências e inicialização do servidor.
* `prisma/`: Configuração do banco de dados SQLite e script de seed.
* `prisma/seed.ts`: Popula o banco com dados iniciais.

## Como Rodar

Siga os passos abaixo (na raiz do projeto) para preparar o ambiente:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Gerar o Prisma Client:**
    ```bash
    npx prisma generate
    ```

3.  **Criar o banco de dados (SQLite) e as tabelas:**
    ```bash
    npm run prisma:migrate
    ```

4.  **Popular o banco com dados de teste :**
    ```bash
    npm run prisma:seed
    ```

5.  **(Opcional) Confirmar que o projeto compila sem erros:**
    ```bash
    npx tsc --noEmit
    ```

## Execução

Para rodar a API em modo de desenvolvimento (reinicia ao salvar arquivos):

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.
*Nota: A primeira execução pode demorar alguns segundos para gerar as credenciais de teste do Ethereal Mail.*

## Como Testar

Utilize o **cURL** (terminal) ou ferramentas como **Postman/Insomnia** para enviar requisições POST.

Você pode utilizar o gitbash para executar os comandos abaixo usando o cURL, ele parece estar funcionando muito bem (mas claro que o melhor seria utilizar Linux).


### Cenário 1: Compra de Livro Físico (Com Frete)
O sistema deve calcular R$ 10,00 de frete.

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacaxi123@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

### Cenário 2: Compra de E-book (Digital)
Produto digital (ID 2). Observe como o código atual trata isso (gera frete incorreto ou lógica misturada).

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "abacate123@ethereal.email",
  "items": [{ "productId": 2, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

## Árvore de Arquivos (Pós-Refatoração)

```text
src/
├── controllers/                     # Camada HTTP
│   └── OrderController.ts             # Recebe a requisição e devolve a resposta HTTP
├── domain/                          # Regras de negócio puras
│   ├── BusinessError.ts               # Erro de regra de negócio (vira 400)
│   ├── IProduct.ts                    # Contrato do produto
│   ├── PhysicalProduct.ts             # Produto físico (frete R$ 10)
│   ├── DigitalProduct.ts              # Produto digital (sem frete)
│   └── ProductFactory.ts              # Cria o produto certo a partir do banco
├── services/                        # Orquestração do fluxo do pedido
│   ├── OrderService.ts                # Fluxo do pedido: valida, paga, salva e notifica
│   └── NotificationService.ts         # Monta o e-mail de confirmação
├── providers/                       # Ferramentas externas (e-mail)
│   ├── IMailProvider.ts               # Contrato de envio de e-mail
│   └── EtherealMailProvider.ts        # Envio via Nodemailer (Ethereal)
├── repositories/                    # Acesso ao banco de dados
│   ├── IOrderRepository.ts            # Contrato de pedidos
│   ├── PrismaOrderRepository.ts       # Pedidos com Prisma
│   ├── IProductRepository.ts          # Contrato de produtos
│   └── PrismaProductRepository.ts     # Produtos com Prisma
├── payments/                        # Formas de pagamento
│   ├── IPaymentMethod.ts              # Contrato de pagamento
│   ├── CreditCardPayment.ts           # Cartão de crédito
│   ├── DebitCardPayment.ts            # Cartão de débito
│   ├── PixPayment.ts                  # Pix
│   └── PaymentMethodRegistry.ts       # Escolhe o pagamento pelo nome
├── lib/                             # Utilitários (logs)
│   └── logger.ts                      # Configuração do Winston
├── app.ts                             # Express e injeção de dependências
└── server.ts                          # Inicia o servidor
```



