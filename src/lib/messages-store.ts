export interface ConversationMessage {
  id: number;
  sender: "client" | "banque";
  text: string;
  date: string;
}

export interface Conversation {
  id: number;
  clientId: number;
  clientName: string;
  clientNumber: string;
  subject: string;
  category: string;
  status: "ouvert" | "ferme";
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

let nextId = 100;
let nextMsgId = 1000;

export const CONVERSATIONS: Conversation[] = [];

export function initClientConversations(clientId: number, clientName: string, clientNumber: string) {
  if (CONVERSATIONS.some((c) => c.clientId === clientId)) return;

  const now = new Date().toLocaleDateString("fr-FR");
  CONVERSATIONS.push({
    id: nextId++,
    clientId,
    clientName,
    clientNumber,
    subject: "Bienvenue chez CaixaBank Luxembourg",
    category: "general",
    status: "ferme",
    messages: [
      {
        id: nextMsgId++,
        sender: "banque",
        text: `Cher(e) ${clientName}, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif.\n\nN'hesitez pas a nous contacter pour toute question.\n\nCordialement,\nL'equipe CaixaBank Luxembourg`,
        date: "15/01/2024",
      },
    ],
    createdAt: "15/01/2024",
    updatedAt: "15/01/2024",
  });

  CONVERSATIONS.push({
    id: nextId++,
    clientId,
    clientName,
    clientNumber,
    subject: "Mise a jour de vos conditions tarifaires",
    category: "information",
    status: "ouvert",
    messages: [
      {
        id: nextMsgId++,
        sender: "banque",
        text: "Nous vous informons que vos conditions tarifaires ont ete mises a jour a compter du 1er octobre 2024.\n\nVous pouvez consulter le detail dans la rubrique Tarifs de votre espace client.\n\nPour toute question, n'hesitez pas a repondre a ce message.\n\nCordialement,\nService Client CaixaBank Luxembourg",
        date: "10/09/2024",
      },
    ],
    createdAt: "10/09/2024",
    updatedAt: "10/09/2024",
  });
}

export function getClientConversations(clientId: number): Conversation[] {
  return CONVERSATIONS.filter((c) => c.clientId === clientId).sort(
    (a, b) => b.id - a.id
  );
}

export function getAllConversations(): Conversation[] {
  return [...CONVERSATIONS].sort((a, b) => b.id - a.id);
}

export function getConversation(id: number): Conversation | undefined {
  return CONVERSATIONS.find((c) => c.id === id);
}

export function createConversation(data: {
  clientId: number;
  clientName: string;
  clientNumber: string;
  subject: string;
  category: string;
  message: string;
}): Conversation {
  const now = new Date().toLocaleDateString("fr-FR");
  const conv: Conversation = {
    id: nextId++,
    clientId: data.clientId,
    clientName: data.clientName,
    clientNumber: data.clientNumber,
    subject: data.subject,
    category: data.category,
    status: "ouvert",
    messages: [
      {
        id: nextMsgId++,
        sender: "client",
        text: data.message,
        date: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  CONVERSATIONS.push(conv);
  return conv;
}

export function addMessage(conversationId: number, sender: "client" | "banque", text: string): ConversationMessage | null {
  const conv = CONVERSATIONS.find((c) => c.id === conversationId);
  if (!conv) return null;
  const msg: ConversationMessage = {
    id: nextMsgId++,
    sender,
    text,
    date: new Date().toLocaleDateString("fr-FR"),
  };
  conv.messages.push(msg);
  conv.updatedAt = msg.date;
  if (conv.status === "ferme") conv.status = "ouvert";
  return msg;
}

export function closeConversation(id: number) {
  const conv = CONVERSATIONS.find((c) => c.id === id);
  if (conv) conv.status = "ferme";
}

export const CATEGORIES: Record<string, string> = {
  general: "Question generale",
  compte: "Mon compte",
  carte: "Cartes bancaires",
  virement: "Virements",
  credit: "Credits & Prets",
  reclamation: "Reclamation",
  information: "Information",
  autre: "Autre",
};
