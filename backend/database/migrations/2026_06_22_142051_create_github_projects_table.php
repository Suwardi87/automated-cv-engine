<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('repo_id', 255);
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('raw_readme')->nullable();
            $table->text('ai_summary')->nullable();
            $table->jsonb('tech_stack')->nullable();
            $table->string('repo_url', 255);
            $table->string('live_url', 255)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('last_pushed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_projects');
    }
};
