import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FakerApi from "@/services/fakerApi";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostView = () => {
  const [post, setPost] = useState<any>();
  const [comments, setComments] = useState<any>();
  const router = useRouter();
  const { postId } = router.query;
  const fakeApi = new FakerApi();
  const { toast } = useToast();

  const getComments = () =>
    fakeApi
      .get("/comments", { post_id: Number(postId) })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro",
          description: err.message,
        });
      });

  const getPost = () =>
    fakeApi
      .get("/posts/view", { post_id: Number(postId) })
      .then((res) => {
        setPost(res.data);
        getComments();
      })
      .catch((err) => {
        router.push("/");
        toast({
          variant: "destructive",
          title: "Erro",
          description: err.message,
        });
      });

  useEffect(() => {
    if (postId) getPost();
  }, [postId]);

  const deleteComment = (id) => {
    fakeApi
      .delete("/comments/remove", {
        post_id: Number(postId),
        comment_id: Number(id),
      })
      .then((res) => {
        toast({
          title: "Successo",
          description: res.message,
        });
        getComments();
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Erro",
          description: err.message,
        });
      });
  };

  return (
    <Layout>
      {post ? (
        <>
          <div className="border border-b-1 p-8 rounded-lg">
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {post?.title}
            </h2>
            <p className="mt-6">{post?.content}</p>
          </div>
          <ul role="list" className="divide-y divide-gray-100">
            {comments &&
              comments.map((comment) => (
                <li key={comment?.id} className="flex gap-x-4 py-5">
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600 flex gap-4 flex-1 items-center justify-between">
                    <span>{comment?.content}</span>
                    <div className="flex gap-4">
                      <Link href={`/posts/${post.id}/${comment.id}`}>
                        <Button size="sm" variant="outline">
                          <Pencil2Icon className="w-4 mr-1" /> Editar
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <TrashIcon className="w-4 mr-1" /> Deletar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Atenção</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você tem certeza que deseja remover esse
                              comentário?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteComment(comment.id)}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </p>
                </li>
              ))}
          </ul>
          <p className="text-center mt-6">
            <Link href={`/posts/${postId}/novo-comentario`}>
              <Button>
                <PlusIcon className="w-4 mr-2" /> Novo comentário
              </Button>
            </Link>
          </p>
        </>
      ) : null}
    </Layout>
  );
};

export default PostView;
