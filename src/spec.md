# Specification

## Summary
**Goal:** Construir um app premium de gestão de salão (UI em português) com agenda diária, estoque, catálogo de serviços, fidelidade de clientes, portfólio de fotos e atualizações de status, com tema elegante em preto/branco/dourado.

**Planned changes:**
- Criar navegação principal persistente com 4 seções: “Agenda de Hoje”, “Controle de Estoque”, “Catálogo de Serviços”, “Fidelidade Clientes”, cada uma com tela própria e estados vazios em português.
- Implementar no backend (ator único Motoko) modelos de dados e APIs CRUD para: agendamentos, produtos de estoque, serviços, clientes (com preferências/fidelidade), fotos de portfólio e atualizações de status, incluindo consultas para “hoje”, filtros e ordenação.
- Implementar “Agenda de Hoje”: criar/editar/cancelar agendamentos com seleção/criação de cliente, seleção de serviços, horário, duração, notas, status, lista do dia e navegação básica por data.
- Implementar “Controle de Estoque”: CRUD de produtos (nome, marca, categoria, unidade, quantidade, mínimo, notas de fornecedor) + ajustes de estoque (entrada/saída) com motivo, timestamp e histórico de movimentações; busca e filtro de baixo estoque.
- Implementar “Catálogo de Serviços”: CRUD com nome, descrição, duração, preço (R$ pt-BR) e ativo/inativo; somente serviços ativos disponíveis na criação/edição de agendamentos.
- Implementar “Fidelidade Clientes”: perfis com contato, preferências, alergias/sensibilidades, notas (ex.: cor/fórmula), serviços preferidos e histórico de visitas vinculado a agendamentos; busca por nome e telefone/email.
- Implementar portfólio: upload e visualização de fotos vinculadas a cliente e/ou agendamento, com galeria (miniaturas), visualização ampliada e metadados (data, legenda opcional).
- Implementar atualizações de status: entradas com timestamp por agendamento, linha do tempo, exibição do status mais recente e ação “Copiar atualização” (texto em português para área de transferência).
- Aplicar tema visual coeso “high-end” (preto/branco com acentos dourados) em listas, formulários e páginas de detalhe; incluir e renderizar assets estáticos de marca em `frontend/public/assets/generated`.

**User-visible outcome:** Usuários conseguem operar o dia do salão em português: gerenciar agendamentos do dia, controlar estoque com alertas e histórico, manter catálogo de serviços e preços, registrar preferências e histórico de clientes, anexar fotos de resultados e registrar/compartilhar (via copiar) atualizações de status — tudo com visual premium.
