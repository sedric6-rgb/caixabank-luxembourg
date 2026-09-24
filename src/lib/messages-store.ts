import { shared, nextId } from "@/lib/shared-store";

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

export const CONVERSATIONS: Conversation[] = shared<Conversation>("conversations", () => []);

function newConversationId(): number {
  return nextId(CONVERSATIONS, 100);
}

function newMessageId(): number {
  return nextId(CONVERSATIONS.flatMap((c) => c.messages), 1000);
}

export function initClientConversations(clientId: number, clientName: string, clientNumber: string): boolean {
  if (CONVERSATIONS.some((c) => c.clientId === clientId)) return false;

  const now = new Date().toLocaleDateString("fr-FR");
  CONVERSATIONS.push({
    id: newConversationId(),
    clientId,
    clientName,
    clientNumber,
    subject: "Bienvenue chez CaixaBank Luxembourg",
    category: "general",
    status: "ferme",
    messages: [
      {
        id: newMessageId(),
        sender: "banque",
        text: `Cher(e) ${clientName}, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif.\n\nN'hesitez pas a nous contacter pour toute question.\n\nCordialement,\nL'equipe CaixaBank Luxembourg`,
        date: "15/01/2026",
      },
    ],
    createdAt: "15/01/2026",
    updatedAt: "15/01/2026",
  });

  CONVERSATIONS.push({
    id: newConversationId(),
    clientId,
    clientName,
    clientNumber,
    subject: "Mise a jour de vos conditions tarifaires",
    category: "information",
    status: "ouvert",
    messages: [
      {
        id: newMessageId(),
        sender: "banque",
        text: "Nous vous informons que vos conditions tarifaires ont ete mises a jour a compter du 1er octobre 2026.\n\nVous pouvez consulter le detail dans la rubrique Tarifs de votre espace client.\n\nPour toute question, n'hesitez pas a repondre a ce message.\n\nCordialement,\nService Client CaixaBank Luxembourg",
        date: "10/09/2026",
      },
    ],
    createdAt: "10/09/2026",
    updatedAt: "10/09/2026",
  });
  return true;
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
    id: newConversationId(),
    clientId: data.clientId,
    clientName: data.clientName,
    clientNumber: data.clientNumber,
    subject: data.subject,
    category: data.category,
    status: "ouvert",
    messages: [
      {
        id: newMessageId(),
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
    id: newMessageId(),
    sender,
    text,
    date: new Date().toLocaleDateString("fr-FR"),
  };
  conv.messages.push(msg);
  conv.updatedAt = msg.date;
  if (conv.status === "ferme") conv.status = "ouvert";
  return msg;
}

export function createBroadcastConversation(data: {
  clientId: number;
  clientName: string;
  clientNumber: string;
  subject: string;
  category: string;
  message: string;
}): Conversation {
  const now = new Date().toLocaleDateString("fr-FR");
  const conv: Conversation = {
    id: newConversationId(),
    clientId: data.clientId,
    clientName: data.clientName,
    clientNumber: data.clientNumber,
    subject: data.subject,
    category: data.category,
    status: "ouvert",
    messages: [
      {
        id: newMessageId(),
        sender: "banque",
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
