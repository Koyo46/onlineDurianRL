<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orderd_fruits', function (Blueprint $table) {
            $table->string('fruit1')->nullable();
            $table->integer('fruit1_count')->nullable();
            $table->string('fruit2')->nullable();
            $table->integer('fruit2_count')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orderd_fruits', function (Blueprint $table) {
            //
        });
    }
};
