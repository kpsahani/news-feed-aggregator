<?php

namespace App\Console;

use App\Console\Commands\FetchNewsArticles;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {

         $schedule->command(FetchNewsArticles::class, ['newsapi'])->everyThirtyMinutes()->appendOutputTo(storage_path('logs/fetch_news_articles.log'));

         $schedule->command(FetchNewsArticles::class, ['nytimes'])->everyThirtyMinutes()->appendOutputTo(storage_path('logs/fetch_news_articles.log'));

         $schedule->command(FetchNewsArticles::class, ['theguardian'])->everyThirtyMinutes()->appendOutputTo(storage_path('logs/fetch_news_articles.log'));
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
