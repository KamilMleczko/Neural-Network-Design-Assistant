import { Badge } from "@nndm/ui/badge";
import { Button } from "@nndm/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@nndm/ui/card";
import { ArrowRight, Eye, GitFork, Search, Sparkles, Star } from "lucide-react";

export const SeeItInAction = () => {
  return (
    <section className="bg-gradient-to-b from-background to-muted/20 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            Live Preview
          </Badge>
          <h2 className="mb-4 font-bold text-4xl md:text-5xl">See It In Action</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Watch how Veille transforms your research workflow with AI-powered insights
          </p>
        </div>

        {/* Mock Interface Container */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 scale-75 transform animate-pulse rounded-full bg-primary/5 blur-3xl" />

          <div className="relative rounded-2xl border border-border/50 bg-card/50 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            {/* Search Bar Mockup */}
            <div className="mb-8">
              <div className="group relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 transform text-muted-foreground" />
                <div className="w-full rounded-lg border border-border bg-background py-4 pr-4 pl-12 font-medium text-foreground shadow-sm transition-shadow group-hover:shadow-md">
                  Best architecture for medical image segmentation
                </div>
                <div className="-translate-y-1/2 absolute top-1/2 right-4 transform">
                  <Badge className="animate-pulse">Searching...</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column: Paper Results */}
              <div className="space-y-4">
                <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                  Top Research Papers
                </h3>

                {/* Paper Card 1 */}
                <Card className="border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">
                        U-Net: Convolutional Networks for Biomedical Image Segmentation
                      </CardTitle>
                      <Badge className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30">
                        98%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      A novel architecture that achieves state-of-the-art segmentation results with
                      fewer training images...
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> 2,847 citations
                      </span>
                      <span>2015</span>
                      <Badge variant="outline" className="text-xs">
                        Computer Vision
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Paper Card 2 */}
                <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">
                        Attention U-Net: Learning Where to Look for the Pancreas
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        94%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      Attention gates automatically learn to focus on target structures of varying
                      shapes and sizes...
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> 1,523 citations
                      </span>
                      <span>2018</span>
                      <Badge variant="outline" className="text-xs">
                        Medical AI
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* GitHub Repo Card */}
                <Card className="bg-accent/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <GitFork className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-base">medical-image-segmentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      PyTorch implementation of U-Net with attention mechanisms for medical imaging
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> 3.2k
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> 847
                      </span>
                      <Badge variant="outline" className="text-xs">
                        PyTorch
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Chat Interface */}
              <div className="space-y-4">
                <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                  AI-Powered Q&A
                </h3>

                <Card className="bg-accent/5">
                  <CardContent className="space-y-4 p-6">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                        <p className="text-sm">What datasets did they use?</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="space-y-2">
                            <p className="text-foreground text-sm">
                              The U-Net paper primarily used the{" "}
                              <strong>ISBI Cell Tracking Challenge dataset</strong> and the{" "}
                              <strong>EM segmentation challenge dataset</strong> from ISBI 2012.
                            </p>
                            <p className="text-muted-foreground text-sm">
                              They demonstrated that their architecture works well with very few
                              training images - achieving impressive results with just 30 training
                              samples.
                            </p>
                            <div className="flex items-center gap-2 pt-2 text-muted-foreground text-xs">
                              <Eye className="h-3 w-3" />
                              <span>Referenced from paper sections 3.1 and 4.2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Follow-up */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                        <p className="text-sm">Show me the code implementation</p>
                      </div>
                    </div>

                    {/* AI Response with Code Reference */}
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="space-y-2">
                            <p className="text-foreground text-sm">
                              I found a highly-rated PyTorch implementation in the{" "}
                              <strong>medical-image-segmentation</strong> repository above.
                            </p>
                            <p className="text-muted-foreground text-sm">
                              It includes attention mechanisms and data augmentation strategies
                              mentioned in the papers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights Card */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-sm">Key Insight</h4>
                        <p className="text-muted-foreground text-xs">
                          U-Net architecture remains the foundation for medical image segmentation,
                          with 95% of recent papers building upon or comparing against it.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12 text-center">
              <Button size="lg" className="group shadow-lg transition-all hover:shadow-xl">
                Try It Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="mt-3 text-muted-foreground text-sm">
                No credit card required • Start researching in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
