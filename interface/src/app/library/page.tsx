import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { libraryItems } from "@/lib/library-data";
import { AuraSuggestionCard } from "@/components/dashboard/aura-suggestion-card";
import { ComplementaryTherapyCard } from "@/components/library/complementary-therapy-card";
import Link from "next/link";

export default function LibraryPage() {
    return (
        <div className="flex flex-col h-full">
            <Header title="Guia de Bem-Estar" />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <p className="text-muted-foreground mb-6 max-w-2xl">Uma coleção de recursos para ajudá-lo a relaxar, recarregar e encontrar o equilíbrio. Selecione uma atividade para começar.</p>
                
                <div className="space-y-6">
                    <AuraSuggestionCard />
                    <ComplementaryTherapyCard />

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {libraryItems.map((item) => (
                             <Link key={item.id} href={item.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                <Card className="overflow-hidden group flex flex-col w-full hover:border-primary/50 transition-colors">
                                    <CardHeader className="p-0">
                                        <div className="relative aspect-video">
                                            <Image 
                                                src={item.imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                data-ai-hint={item.imageHint}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 flex-1">
                                        <p className="text-sm text-primary font-medium">{item.category}</p>
                                        <CardTitle className="text-lg mt-1">{item.title}</CardTitle>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">{item.duration}</p>
                                        <Button size="sm" asChild>
                                            <div>
                                                <PlayCircle className="mr-2 h-6 w-6" />
                                                Reproduzir
                                            </div>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
