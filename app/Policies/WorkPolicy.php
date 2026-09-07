<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Work;

class WorkPolicy
{
    public function update(User $user, Work $work): bool
    {
        return $user->id === $work->student_user_id;
    }

    public function delete(User $user, Work $work): bool
    {
        return $user->id === $work->student_user_id;
    }
}
