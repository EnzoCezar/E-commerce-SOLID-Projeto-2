# E-commerce SOLID — Projeto 2

## Estrutura de Diretórios

* `src/container/`: Container de IoC (InversifyJS). `types.ts` define os símbolos de injeção e `container.ts` é o único lugar que conhece as classes concretas; ele escolhe as implementações conforme o `APP_ENV`.
* `src/controllers/`: Camada HTTP. O `OrderController` recebe a requisição, chama o `OrderService` e devolve a resposta.
* `src/domain/`: Regras de negócio puras: produtos (`PhysicalProduct`, `DigitalProduct`), `ProductFactory` e `BusinessError`.
* `src/services/`: `OrderService` (fluxo do pedido) e `NotificationService` (monta o e-mail de confirmação).
* `src/providers/`: Ferramentas externas. `IMailProvider`, `EtherealMailProvider` (modo dev, Nodemailer) e `ConsoleMailProvider` (modo test, imprime o e-mail no console).
* `src/repositories/`: Acesso a dados. Interfaces, implementações com Prisma (modo dev) e `InMemoryOrderRepository` (modo test, pedidos em memória).
* `src/payments/`: Formas de pagamento (crédito, débito e Pix) e o `PaymentMethodRegistry`.
* `src/lib/logger.ts`: Utilitário de log (Winston - procure mais sobre ele, é muito util em projetos reais).
* `src/app.ts` & `src/server.ts`: Configuração do Express (a rota pega o controller pronto do container) e inicialização do servidor.
* `prisma/`: Configuração do banco de dados SQLite e script de seed.
* `prisma/seed.ts`: Popula o banco com dados iniciais.
* `.env.example`: Modelo do arquivo `.env`, com a variável `APP_ENV`.

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

4.  **Popular o banco com dados de teste:**
    ```bash
    npm run prisma:seed
    ```

5.  **Criar o arquivo `.env` a partir do modelo:**
    ```bash
    cp .env.example .env
    ```
    No PowerShell ou cmd, use `copy .env.example .env`.

6.  **(Opcional) Confirmar que o projeto compila sem erros:**
    ```bash
    npx tsc --noEmit
    ```

## Modos de Execução (APP_ENV)

O modo é escolhido pela variável `APP_ENV` no arquivo `.env`. As classes são trocadas apenas no `src/container/container.ts`, sem alterar services nem controllers.

| APP_ENV | E-mail | Pedidos |
|---------|--------|---------|
| `dev`   | Ethereal (envio de teste real, precisa de internet) | Banco SQLite via Prisma |
| `test`  | Impresso no console do servidor | Guardados em memória (array), somem ao reiniciar; não precisa de internet |

Para trocar de modo, mude só o `APP_ENV` no `.env` e **reinicie o servidor**, pois a variável é lida uma única vez na inicialização.

## Execução

Para rodar a API em modo de desenvolvimento (reinicia ao salvar arquivos):

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`.
*Nota: No modo `dev`, a primeira execução pode demorar alguns segundos para gerar as credenciais de teste do Ethereal Mail.*

## Como Testar

Utilize o **cURL** (terminal) ou ferramentas como **Postman/Insomnia** para enviar requisições POST.

Você pode utilizar o gitbash para executar os comandos abaixo usando o cURL, ele parece estar funcionando muito bem (mas claro que o melhor seria utilizar Linux).

Os mesmos cenários valem para os dois modos:

* **`APP_ENV=dev`:** a resposta traz em `emailPreview` um link do Ethereal; abra no navegador para ver o e-mail.
* **`APP_ENV=test`:** a resposta traz `e-mail impresso no console` em `emailPreview`; o e-mail aparece no terminal onde o servidor está rodando. Funciona com a internet desligada.

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
Produto digital (ID 2): não deve ter frete.

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
.
├── .env.example                     # Modelo do .env (define APP_ENV=dev ou test)
├── prisma/                          # Banco SQLite, migrations e seed
└── src/
    ├── container/                   # Container de IoC (InversifyJS)
    │   ├── types.ts                   # Símbolos usados para injetar as dependências
    │   └── container.ts               # Único lugar que conhece as classes concretas; escolhe dev ou test
    ├── controllers/                 # Camada HTTP
    │   └── OrderController.ts         # Recebe a requisição e devolve a resposta HTTP
    ├── domain/                      # Regras de negócio puras
    │   ├── BusinessError.ts           # Erro de regra de negócio (vira 400)
    │   ├── IProduct.ts                # Contrato do produto
    │   ├── PhysicalProduct.ts         # Produto físico (frete R$ 10)
    │   ├── DigitalProduct.ts          # Produto digital (sem frete)
    │   └── ProductFactory.ts          # Cria o produto certo a partir do banco
    ├── services/                    # Orquestração do fluxo do pedido
    │   ├── OrderService.ts            # Fluxo do pedido: valida, paga, salva e notifica
    │   └── NotificationService.ts     # Monta o e-mail de confirmação
    ├── providers/                   # Ferramentas externas (e-mail)
    │   ├── IMailProvider.ts           # Contrato de envio de e-mail
    │   ├── EtherealMailProvider.ts    # Modo dev: envio via Nodemailer (Ethereal)
    │   └── ConsoleMailProvider.ts     # Modo test: imprime o e-mail no console (sem internet)
    ├── repositories/                # Acesso a dados
    │   ├── IOrderRepository.ts        # Contrato de pedidos
    │   ├── PrismaOrderRepository.ts   # Modo dev: pedidos salvos com Prisma
    │   ├── InMemoryOrderRepository.ts # Modo test: pedidos guardados em memória (array)
    │   ├── IProductRepository.ts      # Contrato de produtos
    │   └── PrismaProductRepository.ts # Produtos com Prisma
    ├── payments/                    # Formas de pagamento
    │   ├── IPaymentMethod.ts          # Contrato de pagamento (inclui o name)
    │   ├── CreditCardPayment.ts       # Cartão de crédito
    │   ├── DebitCardPayment.ts        # Cartão de débito
    │   ├── PixPayment.ts              # Pix
    │   └── PaymentMethodRegistry.ts   # Recebe todos os pagamentos (@multiInject) e escolhe pelo name
    ├── lib/                         # Utilitários (logs)
    │   └── logger.ts                  # Configuração do Winston
    ├── app.ts                         # Express e rota; pega o controller pronto do container
    └── server.ts                      # Carrega reflect-metadata/dotenv e inicia o servidor
```
