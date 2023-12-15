<?php

namespace App\Services;

use GuzzleHttp\Client;

class NewsService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.news_api.key');
        $this->baseUrl = config('services.news_api.url');
    }

    public function getArticleFromNewsApi($params = [])
    {
        $client = new Client();

        $response = $client->get($this->baseUrl . '/top-headlines?category=business,entertainment,general,health,science,sports,technology', [
            'query' => array_merge(['apiKey' => $this->apiKey], $params),
        ]);

        return json_decode($response->getBody(), true);
    }

    public function getArticleFromNewYorkTime($params = [])
    {
        $client = new Client();

        $response = $client->get('https://api.nytimes.com/svc/topstories/v2/us.json', [
            'query' => array_merge(['api-key' => 'zB0hxVeEcokhAWXcxkbZewLC6AKiQRgb'], $params),
        ]);

        return json_decode($response->getBody(), true);
    }

    public function getArticleFromTheGuardianApi($params = [])
    {
        $client = new Client();

        $response = $client->get('https://content.guardianapis.com/search', [
            'query' => array_merge(['api-key' => '8c011730-c62a-45aa-b0bd-22d592a07da0'], $params),
        ]);

        return json_decode($response->getBody(), true);
    }
}
