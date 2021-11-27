import {
  doc,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "@firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { AuthCheck } from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import { auth, db } from "../../lib/firebase";
import styles from "../../styles/Admin.module.css";

export const AdminPostEdit: NextPage = () => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
};

export default AdminPostEdit;

const PostManager: React.FC = () => {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    db,
    `users/${auth.currentUser?.uid}/posts/${slug}`
  );

  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

interface PostFormProps {
  postRef: DocumentReference<DocumentData>;
  defaultValues: FieldValues;
  preview: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  postRef,
  defaultValues,
  preview,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  // const { isValid, isDirty } = formState;

  const updatePost = async (values: FieldValues) => {
    await updateDoc(postRef, {
      content: values.content,
      published: values.published,
      updatedAt: serverTimestamp(),
    });

    reset({ content: values.content, published: values.published });

    toast.success("Post Updated Successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          {...register("content", {
            maxLength: { value: 2000, message: "content is too long!" },
            minLength: { value: 10, message: "content is too short!" },
            required: { value: true, message: "content is required!" },
          })}
        />

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            {...register("published")}
            className={styles.checkbox}
            type="checkbox"
            onChange={(e) => {}}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save changes
        </button>
      </div>
    </form>
  );
};
