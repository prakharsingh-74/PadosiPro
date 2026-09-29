import { supabase } from '../config/database';

export class TaskService {
  static async getCatalog() {
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (catError) {
      console.error('Error fetching categories:', catError);
      throw { statusCode: 500, message: 'Failed to load task categories.' };
    }

    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .order('name', { ascending: true });

    if (taskError) {
      console.error('Error fetching tasks:', taskError);
      throw { statusCode: 500, message: 'Failed to load task catalogue.' };
    }

    // Group tasks by category
    const catalog = (categories || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon_name: cat.icon_name,
      is_soon: cat.is_soon,
      tasks: (tasks || [])
        .filter((t) => t.category_id === cat.id)
        .map((t) => ({
          ...t,
          services: typeof t.services === 'string' ? JSON.parse(t.services) : (t.services || [])
        }))
    }));

    return catalog;
  }

  /**
   * Save user selected tasks
   */
  static async saveUserTasks(userId: string, taskIds: string[]) {
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      throw { statusCode: 400, message: 'Please select at least one task.' };
    }

    // Clear previous selections for user
    await supabase.from('user_tasks').delete().eq('user_id', userId);

    // Insert new task selections
    const recordsToInsert = taskIds.map((taskId) => ({
      user_id: userId,
      task_id: taskId
    }));

    const { error } = await supabase.from('user_tasks').insert(recordsToInsert);

    if (error) {
      console.error('Error saving user tasks:', error);
      throw { statusCode: 500, message: 'Failed to save selected tasks.' };
    }

    return this.getUserTasks(userId);
  }

  /**
   * Get tasks selected by user
   */
  static async getUserTasks(userId: string) {
    const { data: userTasks, error } = await supabase
      .from('user_tasks')
      .select(`
        id,
        created_at,
        task:tasks (
          id,
          name,
          short_description,
          icon_name,
          category:categories (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user selected tasks:', error);
      throw { statusCode: 500, message: 'Failed to fetch your selected tasks.' };
    }

    const tasks = (userTasks || [])
      .map((ut: any) => ut.task)
      .filter(Boolean);

    return tasks;
  }
}
