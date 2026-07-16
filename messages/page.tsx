"use client";

import Image from "next/image";
import { Send } from "lucide-react";
import { useState } from "react";
import { useMissionData } from "@/lib/store";
import { EmptyState, PageContainer, PrimaryButton, SectionHeader, TextInput } from "@/components/ui";

export default function MessagesPage() {
  const store = useMissionData();
  const { data } = store;
  const conversations = data.conversations.filter((conversation) => conversation.memberIds.includes(data.currentUserId)).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const active = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];
  const other = active ? data.profiles.find((profile) => active.memberIds.includes(profile.id) && profile.id !== data.currentUserId) : null;
  const messages = active ? data.messages.filter((message) => message.conversationId === active.id) : [];

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = String(form.get("body") || "").trim();
    if (!body || !active) return;
    store.sendMessage(active.id, body);
    event.currentTarget.reset();
  }

  return (
    <PageContainer>
      <SectionHeader eyebrow="Messages" title="Keep mission conversations moving." text="Message builders you meet through pools. This stays intentionally lightweight: introductions, follow-ups, and focused collaboration." />
      <div className="messages-shell">
        <aside className="messages-list">
          <div className="messages-list-header">
            <h2>Conversations</h2>
            <p>{conversations.length} active threads</p>
          </div>
          <div className="messages-people">
            {conversations.map((conversation) => {
              const person = data.profiles.find((profile) => conversation.memberIds.includes(profile.id) && profile.id !== data.currentUserId)!;
              return (
                <button key={conversation.id} className={`focus-ring messages-person ${active?.id === conversation.id ? "messages-person-active" : ""}`} type="button" onClick={() => setActiveId(conversation.id)}>
                  <Image src={person.avatarUrl} alt={person.name} width={48} height={48} />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{new Date(conversation.updatedAt).toLocaleString()}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="messages-thread">
          {other ? (
            <>
              <div className="messages-thread-header">
                <Image src={other.avatarUrl} alt={other.name} width={48} height={48} />
                <div>
                  <h2>{other.name}</h2>
                  <p>@{other.username}</p>
                </div>
              </div>
              <div className="messages-bubbles">
                {messages.map((message) => (
                  <div key={message.id} className={`message-bubble ${message.senderId === data.currentUserId ? "message-bubble-me" : ""}`}>
                    <p>{message.body}</p>
                    <time>{new Date(message.createdAt).toLocaleTimeString()}</time>
                  </div>
                ))}
              </div>
              <form className="messages-composer" onSubmit={send}>
                <TextInput name="body" placeholder="Write a message..." />
                <PrimaryButton type="submit"><Send size={16} /> Send</PrimaryButton>
              </form>
            </>
          ) : (
            <div className="messages-empty">
              <EmptyState title="No conversations yet" text="Open a member profile from any pool and start a focused mission conversation." />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
