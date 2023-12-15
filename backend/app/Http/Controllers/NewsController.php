<?php

namespace App\Http\Controllers;

use App\Services\NewsService;
use App\Models\Article;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Arr;


class NewsController extends Controller
{
    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function newsApi()
    {

        // $ar = $this->newsService->getArticleFromNewsApi([
        //     'country' => 'us', // Adjust based on your requirements
        // ]);
        // return  response()->json($ar);

        $this->insertOrUpdateArticles('newsApi', $this->newsService->getArticleFromNewsApi([
            'country' => 'us', // Adjust based on your requirements
        ]));

        return response()->json(['message' => 'Data inserted or updated successfully.']);
    }

    public function newYorkTimesApi()
    {
        // $ar = $this->newsService->getArticleFromNewYorkTime([]);
        // return  response()->json($ar['results']);

        $this->insertOrUpdateArticles('newYorkTimesApi', $this->newsService->getArticleFromNewYorkTime([]));

        return response()->json(['message' => 'Data inserted or updated successfully.']);
    }

    public function theGuardianApi()
    {
        // $ar = $this->newsService->getArticleFromTheGuardianApi([]);
        // return  response()->json($ar);

        $this->insertOrUpdateArticles('theGuardianApi', $this->newsService->getArticleFromTheGuardianApi([]));

        return response()->json(['message' => 'Data inserted or updated successfully.']);
    }

    protected function insertOrUpdateArticles($sourceName, $articles)
    {
        if($sourceName == 'newsApi'){
            foreach ($articles['articles'] as $article) {
                if($article['source']['id']){
                    try{
                        $formattedPublishedAt = $this->parseDate($article['publishedAt']);

                        Article::updateOrInsert(
                            ['title' => $article['title']],
                            [
                                'source_name' => 'The News',
                                'author' => $article['author'],
                                'category' => $article['source']['name'],
                                'title' => $article['title'],
                                'description' => $article['description'],
                                'content' => $article['content'],
                                'url' => $article['url'],
                                'image' => $article['urlToImage'],
                                'publishedAt' => $formattedPublishedAt,
                            ]
                        );
                    }
                    catch(Exception $e){

                    }
                }
            }
        }
        else if($sourceName == 'newYorkTimesApi'){

            foreach ($articles['results'] as $article) {
                $formattedPublishedAt = $this->parseDate($article['published_date']);

                $image = '';
                if (Arr::has($article, 'multimedia.1.url')) {
                    $image = Arr::get($article, 'multimedia.1.url');
                }

                Article::updateOrInsert(
                    ['title' => $article['title']],
                    [
                        'source_name' => 'NewYork Times',
                        'author' => $article['byline'],
                        'category' => $article['subsection'],
                        'title' => $article['title'],
                        'description' => $article['abstract'],
                        'content' => $article['abstract'],
                        'url' => $article['url'],
                        'image' => $image,
                        'publishedAt' => $formattedPublishedAt,
                    ]
                );
            }
        }else if($sourceName == 'theGuardianApi'){
            foreach ($articles['response']['results'] as $article) {
                $formattedPublishedAt = $this->parseDate($article['webPublicationDate']);

                Article::updateOrInsert(
                    ['title' => $article['webTitle']],
                    [
                        'source_name' => 'The Guardian',
                        'author' => 'none',
                        'category' => $article['sectionName'],
                        'title' => $article['webTitle'],
                        'description' => '',
                        'content' => '',
                        'url' => $article['webUrl'],
                        'image' => '',
                        'publishedAt' => $formattedPublishedAt,
                    ]
                );
            }
        }
    }

    protected function parseDate($date){
        return Carbon::parse($date)->toDateTimeString();
    }
}
