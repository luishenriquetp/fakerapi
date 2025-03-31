import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import FakerApi from "@/services/fakerApi";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { NextPage } from "next";
import Link from "next/link";
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

const Posts: NextPage = () => {
  const [posts, setPosts] = useState([]);
  const fakeApi = new FakerApi();
  const { toast } = useToast();

  const getPosts = () =>
    fakeApi
      .get("/posts", {})
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        setPosts([]);
      });

  useEffect(() => {
    getPosts();
  }, []);

  const deletePost = (id) => {
    fakeApi
      .delete("/posts/remove", { post_id: id })
      .then((res) => {
        toast({
          title: "Successo",
          description: res.message,
        });
        getPosts();
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
      <div className="grid gap-8 grid-cols-12">
        {posts.length ? (
          posts.map((post) => (
            <Card
              key={post.id}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-4">
                <Link href={`/posts/${post.id}`}>
                  <Button>
                    <EyeIcon className="w-4 mr-1" /> Visualizar
                  </Button>
                </Link>
                <Link href={`/posts/${post.id}/editar`}>
                  <Button variant="outline">
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
                        Você tem certeza que deseja remover esse post?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deletePost(post.id)}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <>
            <p className="col-span-12">
              Nenhum post ainda. <br /> <br />
              <Link href="/posts/novo">
                <Button>Comece criando um novo post</Button>
              </Link>
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Posts;
