export interface QuizQuestion {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctAnswerIndex: number;
  bonusAmount: number;
  explanation?: string;
  explanationEn?: string;
  bonusText?: string;
  bonusTextEn?: string;
  imageUrl?: string;
}

export const knowledgeQuiz: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'No SAP Business One, qual é a principal diferença entre as opções "Selecionar Empresa" e "Criar Empresa" ao acessar o sistema?',
    questionEn: 'In SAP Business One, what is the main difference between "Select Company" and "Create Company" when accessing the system?',
    options: [
      'A) Selecionar empresa permite acessar uma base de dados já existente, enquanto criar empresa gera uma nova base com configurações iniciais.',
      'B) Selecionar empresa serve para excluir uma base de dados, enquanto criar empresa apenas visualiza relatórios existentes.',
      'C) Selecionar empresa cria usuários no sistema, enquanto criar empresa altera o plano de contas.',
      'D) Selecionar empresa configura parâmetros fiscais, enquanto criar empresa acessa dados de clientes.',
      'E) Selecionar empresa é usado apenas por consultores, enquanto criar empresa é usado por usuários comuns.',
      'F) Selecionar empresa permite editar fornecedores, enquanto criar empresa serve apenas para alterar moedas.'
    ],
    optionsEn: [
      'A) Select company allows accessing an existing database, while create company generates a new database with initial settings.',
      'B) Select company is used to delete a database, while create company only views existing reports.',
      'C) Select company creates users in the system, while create company changes the chart of accounts.',
      'D) Select company configures tax parameters, while create company accesses customer data.',
      'E) Select company is used only by consultants, while create company is used by regular users.',
      'F) Select company allows editing suppliers, while create company serves only to change currencies.'
    ],
    correctAnswerIndex: 0,
    bonusAmount: 10000,
    explanation: `A alternativa A está correta porque reflete exatamente o funcionamento do sistema.`,
    explanationEn: `Option A is correct because it exactly reflects how the system works.`,
    bonusText: `📘 Dica Bônus Especial:

No SAP Business One, a opção "Selecionar / Criar Empresa" aparece quando você entra no sistema e precisa escolher ou registrar um banco de dados (empresa).

📁 O que "Empresa" significa no SAP B1?
No SAP B1, empresa = banco de dados. Cada empresa tem suas próprias informações:
Clientes
Fornecedores
Produtos
Financeiro
Relatórios
ℹ️ Em outras palavras, cada empresa é um ambiente separado dentro do sistema.

✅ Selecionar Empresa
É quando você:
Escolhe uma empresa já existente
Exemplo: "Empresa de Teste", "Loja Fortaleza", "Matriz"
📘 Você usa isso para entrar e trabalhar normalmente.

🆕 Criar Empresa
É quando você:
Cria um novo banco de dados
Define as configurações iniciais, como:
País
Moeda
Plano de contas
Estrutura fiscal
⚙️ Isso geralmente é feito por:
Consultores
TI
Implementadores do Sistema

📋 Resumo
Selecionar = entrar em uma empresa que já existe
Criar = construir uma nova empresa do zero no sistema

🎓 Dica Profissional (Nível de Entrevista):
"No SAP Business One, selecionar uma empresa permite acessar uma base existente, enquanto criar uma empresa envolve gerar um novo banco de dados com configurações iniciais, como período contábil, moeda e plano de contas."

⚙️ Dica Extra (Nível de Consultor):
Tenha sempre:
1 empresa de teste (sandbox)
1 empresa de produção base (real)
ℹ️ Isso evita quebrar o sistema real.`,
    bonusTextEn: `📘 Special Bonus Tip:

In SAP Business One, the "Select / Create Company" option appears when you enter the system and need to choose or register a database (company).

📁 What does "Company" mean in SAP B1?
In SAP B1, company = database. Each company has its own information:
Customers
Suppliers
Products
Financials
Reports
ℹ️ In other words, each company is a separate environment within the system.

✅ Select Company
This is when you:
Choose an existing company
Example: "Test Company", "Fortaleza Store", "Headquarters"
📘 You use this to log in and work normally.

🆕 Create Company
This is when you:
Create a new database
Define initial settings such as:
Country
Currency
Chart of Accounts
Tax Structure
⚙️ This is usually done by:
Consultants
IT
System Implementers

📋 Summary
Select = Enter an existing company
Create = Build a new company from scratch in the system

🎓 Professional Tip (Interview Level):
"In SAP Business One, selecting a company allows access to an existing database, while creating a company involves generating a new database with initial settings such as accounting period, currency, and chart of accounts."

⚙️ Extra Tip (Consultant Level):
Always have:
1 test company (sandbox)
1 production company (real)
ℹ️ This prevents breaking the live system.`,
    imageUrl: `${import.meta.env.BASE_URL}quiz/q1.png`
  },
  {
    id: 'q2',
    question: 'No contexto de um sistema de gestão ERP corporativo, o que a sigla PCP significa e qual a sua função primária dentro da indústria?',
    questionEn: 'In the context of a corporate ERP management system, what does the acronym PCP stand for and what is its primary function within the industry?',
    options: [
      'Planejamento de Contas Pagas - Focado exclusivamente no setor financeiro.',
      'Planejamento e Controle de Produção - Integrar chão de fábrica com o administrativo.',
      'Programa de Customização de Produtos - Focado no marketing e design.',
      'Perda de Capital Planejada - Focado na evasão fiscal e contabilidade.'
    ],
    optionsEn: [
      'Paid Accounts Planning - Focused exclusively on the financial sector.',
      'Production Planning and Control - Integrate the factory floor with the administrative.',
      'Product Customization Program - Focused on marketing and design.',
      'Planned Capital Loss - Focused on tax evasion and accounting.'
    ],
    correctAnswerIndex: 1,
    bonusAmount: 15000,
    explanationEn: `PCP is critical for synchronization between management and operational execution.`
  },
  {
    id: 'q3',
    question: 'Uma empresa registrou um EBITDA muito alto, porém encerrou o caixa do ano no vermelho (sem dinheiro). O que isso indica?',
    questionEn: 'A company recorded a very high EBITDA, but ended the year with a cash deficit (no money). What does this indicate?',
    options: [
      'A empresa sofreu uma fraude fiscal na bolsa de valores.',
      'A operação em si dá lucro, mas talvez as dívidas passadas e juros devoraram o dinheiro do caixa.',
      'O contador esqueceu de preencher o DRE.',
      'É matematicamente impossível ter EBITDA positivo e caixa negativo no mundo real.'
    ],
    optionsEn: [
      'The company suffered tax fraud on the stock market.',
      'The operation itself is profitable, but perhaps past debts and interest ate up the cash.',
      'The accountant forgot to fill in the P&L.',
      'It is mathematically impossible to have positive EBITDA and negative cash in the real world.'
    ],
    correctAnswerIndex: 1,
    bonusAmount: 40000,
    explanationEn: `Profitability is different from Liquidity. EBITDA measures operational efficiency, not cash flow.`
  }
];

export const surpriseEnglishQuestion = {
  id: 'surprise-eng',
  emailHeader: 'John Muller <jm@customer.com>',
  emailSubject: 'Interested in your products',
  emailBody: `Hello,

I came across your company and I'm interested in learning more about your products. Could you please send me more details, including pricing and delivery options?

Looking forward to your response.

Best regards,
John Muller`,
  question: 'Qual é a melhor resposta para esse cliente?',
  options: [
    'A) Hello John, Thank you for your interest in our company. I will send you all the details about our products, pricing, and delivery options shortly. Please let me know if you have any specific requirements.',
    'B) Hi, we are very busy now. Check our website for information. Bye.',
    'C) I am busy with SAP. Send me your phone number.'
  ],
  correctAnswerIndex: 0,
  bonusAmount: 50,
  explanation: `✅ PARABÉNS! +$ 50 creditado!
🎓 BÔNUS: Aula de Inglês no Mundo dos Negócios

📌 Frase principal do cliente:
"I'm interested in learning more about your products."
👉 Significado: "Estou interessado em conhecer mais sobre seus produtos."

🧠 Expressões importantes

1. "I'm interested in…"
➡️ Usado para demonstrar interesse
I'm interested in your services.
(Estou interessado nos seus serviços)

2. "Could you please…"
➡️ Forma educada de fazer pedidos
Could you please send me more details?
(Você poderia me enviar mais detalhes?)
💡 Isso é MUITO usado no mundo corporativo!

3. "Looking forward to your response"
➡️ Forma profissional de encerrar um e-mail
Significa: "Aguardo sua resposta"

✍️ Estrutura básica de resposta profissional:
📌 Greeting → Hello John,
📌 Agradecimento → Thank you for your interest.
📌 Ação → I will send you the details.
📌 Fechamento → Best regards

🚀 Dica de Ouro: Evite respostas curtas ou frias:
❌ "Check our website"    ❌ "We are busy"
✔️ Sempre seja educado, claro e prestativo!`
};
