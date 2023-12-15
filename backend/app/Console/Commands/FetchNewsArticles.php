<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\NewsController;

class FetchNewsArticles extends Command
{
    protected $signature = 'fetch:news-articles {source}';
    protected $description = 'Fetch news articles from specified source';

    protected $newController;

    public function __construct(NewsController $newController)
    {
        parent::__construct();
        $this->newController = $newController;
    }

    public function handle()
    {
        $source = $this->argument('source');

        switch ($source) {
            case 'newsapi':
                $this->info('Fetching articles from News API...');
                $this->newController->newsApi();
                break;

            case 'nytimes':
                $this->info('Fetching articles from New York Times API...');
                $this->newController->newYorkTimesApi();
                break;

            case 'theguardian':
                $this->info('Fetching articles from The Guardian API...');
                $this->newController->theGuardianApi();
                break;

            default:
                $this->error('Invalid news source specified.');
        }
    }
}
