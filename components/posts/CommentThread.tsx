/**
 * components/posts/CommentThread.tsx — collapsible nested comments (1 level)
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { glass } from '../glass-ui';
import { colors, space, type } from '../../lib/theme';
import { useSocial } from '../../lib/social/useSocial';
import type { PostComment } from '../../lib/social/types';

type Props = {
  postId: string;
  comments: PostComment[];
};

function CommentRow({
  postId,
  comment,
  depth = 0,
}: {
  postId: string;
  comment: PostComment;
  depth?: number;
}) {
  const { getUser, addComment } = useSocial();
  const author = getUser(comment.authorId);
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const hasReplies = (comment.replies?.length ?? 0) > 0;

  return (
    <View style={[styles.row, depth > 0 && styles.nested]}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: author?.avatarColor ?? colors.electricBlue }]} />
        <Text style={styles.author}>{author?.name ?? 'Usuario'}</Text>
        <Text style={styles.time}>{new Date(comment.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <Text style={styles.body}>{comment.body}</Text>
      <View style={styles.actions}>
        {depth === 0 ? (
          <Pressable onPress={() => setReplyOpen((v) => !v)} hitSlop={12}>
            <Text style={styles.actionText}>{replyOpen ? 'Cancelar' : 'Responder'}</Text>
          </Pressable>
        ) : null}
        {hasReplies ? (
          <Pressable onPress={() => setCollapsed((v) => !v)} hitSlop={12}>
            <Text style={styles.actionText}>
              {collapsed ? `Ver ${comment.replies!.length} respuesta(s)` : 'Ocultar respuestas'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {replyOpen && depth === 0 ? (
        <View style={styles.replyBox}>
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder="Escribe una respuesta…"
            placeholderTextColor={colors.dim}
            style={styles.replyInput}
          />
          <Pressable
            onPress={() => {
              if (!reply.trim()) return;
              addComment(postId, reply.trim(), comment.id);
              setReply('');
              setReplyOpen(false);
              setCollapsed(false);
            }}
          >
            <Text style={styles.send}>Enviar</Text>
          </Pressable>
        </View>
      ) : null}
      {!collapsed &&
        comment.replies?.map((r) => (
          <CommentRow key={r.id} postId={postId} comment={r} depth={1} />
        ))}
    </View>
  );
}

export function CommentThread({ postId, comments }: Props) {
  const { addComment } = useSocial();
  const [open, setOpen] = useState(comments.length > 0);
  const [draft, setDraft] = useState('');

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.toggle}>
        <Text style={styles.toggleText}>
          {open ? 'Ocultar comentarios' : `Comentarios (${comments.length})`}
        </Text>
      </Pressable>
      {open ? (
        <View style={styles.list}>
          {comments.length === 0 ? (
            <Text style={styles.empty}>Sé el primero en comentar</Text>
          ) : null}
          {comments.map((c) => (
            <CommentRow key={c.id} postId={postId} comment={c} />
          ))}
          <View style={styles.replyBox}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Escribe un comentario…"
              placeholderTextColor={colors.dim}
              style={styles.replyInput}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar comentario"
              onPress={() => {
                if (!draft.trim()) return;
                addComment(postId, draft.trim());
                setDraft('');
              }}
            >
              <Text style={styles.send}>Publicar</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[2], marginTop: space[2] },
  toggle: { paddingVertical: space[1] },
  toggleText: { color: colors.electricBlue, ...type.footnote, fontWeight: '700' },
  list: { gap: space[3] },
  row: { gap: 4 },
  nested: {
    marginLeft: space[4],
    paddingLeft: space[3],
    borderLeftWidth: 2,
    borderLeftColor: glass.borderViolet,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  dot: { width: 10, height: 10, borderRadius: 999 },
  author: { color: colors.text, ...type.footnote, fontWeight: '700' },
  time: { color: colors.dim, ...type.caption2 },
  body: { color: colors.muted, ...type.callout },
  actions: { flexDirection: 'row', gap: space[3] },
  actionText: { color: colors.electricBlue, ...type.caption1, fontWeight: '600' },
  replyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderWidth: 1,
    borderColor: glass.border,
    borderRadius: 12,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    backgroundColor: 'rgba(11,6,32,0.45)',
  },
  replyInput: { flex: 1, color: colors.text, ...type.footnote, padding: 0 },
  send: { color: colors.electricBlue, ...type.footnote, fontWeight: '700' },
  empty: { color: colors.muted, ...type.footnote },
});
