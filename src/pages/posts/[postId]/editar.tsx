import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import FakerApi from "@/services/fakerApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  title: z
    .string({
      required_error: "O título é obrigatório.",
    })
    .min(2, "O título deve ter no mínimo 2 caracteres."),
  content: z
    .string({
      required_error: "O conteúdo é obrigatório.",
    })
    .min(2, "O conteúdo deve ter no mínimo 2 caracteres."),
});

const PostEdit = () => {
  const [post, setPost] = useState<any>();
  const router = useRouter();
  const { postId } = router.query;
  const fakeApi = new FakerApi();
  const { toast } = useToast();
  const onSubmit = (data: z.infer<typeof FormSchema>) =>
    fakeApi
      .post("/posts/update", { post_id: Number(postId), post: data })
      .then((res) => {
        router.push("/");
        toast({
          title: "Sucesso",
          description: res.message,
        });
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: err.message,
        })
      );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const getPost = () =>
      fakeApi
        .get("/posts/view", { post_id: Number(postId) })
        .then((res) => {
          setPost(res.data);
          setValue("title", res.data.title);
          setValue("content", res.data.content);
        })
        .catch((err) => {
          router.push("/");
          toast({
            variant: "destructive",
            title: "Erro",
            description: err.message,
          });
        });
    if (postId) getPost();
  }, [postId]);

  return (
    <Layout>
      {post ? (
        <>
          <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Editar post
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-10 max-w-sm"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o título do post"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informe o conteúdo do post"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Salvar
              </Button>
              <div className="mt-10 relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">ou</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/">
                  <Button variant="secondary" className="w-full">
                    Voltar
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </>
      ) : null}
    </Layout>
  );
};

export default PostEdit;
