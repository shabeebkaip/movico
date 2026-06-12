import { notFound } from "next/navigation";
import { getPostById } from "@/lib/cms/blog";
import BlogEditor from "../BlogEditor";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return <BlogEditor initialData={post} postId={id} />;
}
