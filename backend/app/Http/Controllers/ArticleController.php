<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Get dynamic page, per_page, search, category, source, and author values from the request
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search');
        $category = $request->query('category');
        $source = $request->query('source');
        $author = $request->query('author');
        $sort = $request->query('sort', 'publishedAt'); // Default sort by publishedAt
        $order = $request->query('order', 'desc'); // Default order by descending

        // Initialize the query builder for articles
        $query = Article::query();

        // Apply search filter
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        // Apply category filter
        if ($category) {
            $query->where('category', $category);
        }

        // Apply source filter
        if ($source) {
            $query->where('source_name', $source);
        }

        // Apply author filter
        if ($author) {
            $query->where('author', $author);
        }

        // Apply sorting and ordering
        $query->orderBy($sort, $order);

        // Fetch paginated articles
        $articles = $query->paginate($perPage, ['*'], 'page', $page);

        // You can customize the response format based on your needs
        return response()->json([
            'success' => true,
            'message' => 'Personalized feed retrieved successfully',
            'data' => [
                'public_feed' => $articles,
            ],
        ]);
    }

    public function getTagsFromArticle(){

        $uniqueCategories = Article::distinct()->pluck('category');

        $uniqueAuthors = Article::distinct()->pluck('author');
        $authorArray = [];

        foreach ($uniqueAuthors as $author){
            $authorName = str_replace("By ", "", $author);
            $authorNamesArray = explode(", ", $authorName);
            $authorArray = array_merge($authorArray, $authorNamesArray);
        }

        $uniqueSourceName = Article::distinct()->pluck('source_name');

        return response()->json([
            'category' => $uniqueCategories,
            'author' => $authorArray,
            'source' => $uniqueSourceName
        ]);

    }
}
