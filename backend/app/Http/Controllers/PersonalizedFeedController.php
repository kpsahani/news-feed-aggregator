<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\UserPreference;
use Illuminate\Auth\AuthenticationException;

class PersonalizedFeedController extends Controller
{
    public function selectPreferences(Request $request)
    {

        try {

            $userId = auth()->id();

            UserPreference::updateOrCreate(
                ['user_id' => $userId],
                [
                    'author' => $request->input('authors'),
                    'category' => $request->input('categories'),
                    'source' => $request->input('sources'),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Preferences saved successfully',
            ]);
        } catch (AuthenticationException $exception) {
            // User is not authenticated, return an error response
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }

    }

    public function getPersonalizedTags(){
        $user = auth()->user();
        $userPreferences = UserPreference::where('user_id', $user->id)->first();

        if($userPreferences){
            $categories = explode(',', $userPreferences->category);
            $sourceNames = explode(',', $userPreferences->source);
            $authors = explode(',', $userPreferences->author);

            $tags = array_merge($categories, $sourceNames, $authors);

            return response()->json([
                'success' => true,
                'message' => 'Personalized tags retrieved successfully',
                'data' => $tags,
            ]);
        }
        else{
            return response()->json([
                'success' => true,
                'message' => 'Please add your prefrences',
                'data' => [],
            ]);
        }

        
    }

    public function getPersonalizedFeed(Request $request)
    {
        try {

            $user = auth()->user();
            $userPreferences = UserPreference::where('user_id', $user->id)->first();

            if (!$userPreferences) {
                // Handle the case where user preferences are not set
                return response()->json([
                    'success' => false,
                    'message' => 'User preferences not set.',
                    'data' => [
                        'personalized_articles' => [
                            'data' => []
                        ],
                    ],
                ], 200);
            }

            $categories = explode(',', $userPreferences->category);
            $sourceNames = explode(',', $userPreferences->source);
            $authors = explode(',', $userPreferences->author);

            $query = Article::query();
            
        $search = $request->query('search');
        $category = $request->query('category');
        $source = $request->query('source');
        $author = $request->query('author');

        // Apply author filter
        if ($search || $author || $source || $category) {
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
        }

        else{
            $query->where(function ($query) use ($categories) {
                foreach ($categories as $category) {
                    $query->orWhere('category', $category);
                }
            })->orWhere(function ($query) use ($sourceNames) {
                foreach ($sourceNames as $sourceName) {
                    $query->orWhere('source_name', $sourceName);
                }
            })->orWhere(function ($query) use ($authors) {
                foreach ($authors as $author) {
                    $query->orWhere('author', $author);
                }
            });
        }

        // Apply sorting
        $sort = $request->query('sort', 'publishedAt'); // Default sort by publishedAt
        $order = $request->query('order', 'desc'); // Default order by descending
        $query->orderBy($sort, $order);

        // Apply pagination
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $personalizedArticles = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'message' => 'Personalized feed retrieved successfully',
                'data' => [
                    'user_preferences' => $userPreferences,
                    'personalized_articles' => $personalizedArticles,
                ],
            ]);
        } catch (AuthenticationException $exception) {
            // User is not authenticated, return an error response
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }
    }
}
