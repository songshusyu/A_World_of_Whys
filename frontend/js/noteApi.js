/**
 * 本地存储笔记管理类
 */
class NoteStorage {
    constructor() {
        this.storageKey = 'zhimiao_notes';
        this.notes = this.loadNotes();
    }

    /**
     * 从localStorage加载笔记
     */
    loadNotes() {
        const notesJson = localStorage.getItem(this.storageKey);
        return notesJson ? JSON.parse(notesJson) : [];
    }

    /**
     * 保存笔记到localStorage
     */
    saveNotes() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * 从Markdown内容中提取标题
     */
    extractTitle(content) {
        if (!content) return '无标题';
        
        const lines = content.trim().split('\n');
        // 查找第一个标题
        for (const line of lines) {
            const match = line.trim().match(/^#\s+(.+)$/);
            if (match) {
                return match[1].trim();
            }
        }
        
        // 如果没有找到标题，使用第一行非空内容
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                return trimmedLine.length > 50 ? trimmedLine.substring(0, 47) + '...' : trimmedLine;
            }
        }
        
        return '无标题';
    }

    /**
     * 获取所有笔记
     */
    getAllNotes() {
        return this.notes;
    }

    /**
     * 获取单个笔记
     */
    getNote(id) {
        return this.notes.find(note => note.id === id);
    }

    /**
     * 创建新笔记
     */
    createNote(noteData) {
        const note = {
            id: this.generateId(),
            title: this.extractTitle(noteData.content),
            content: noteData.content || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.notes.unshift(note);
        this.saveNotes();
        return note;
    }

    /**
     * 更新笔记
     */
    updateNote(id, noteData) {
        const index = this.notes.findIndex(note => note.id === id);
        if (index === -1) return null;

        const note = this.notes[index];
        const updatedNote = {
            ...note,
            title: this.extractTitle(noteData.content),
            content: noteData.content,
            updatedAt: new Date().toISOString()
        };
        
        // 移除旧笔记
        this.notes.splice(index, 1);
        // 将更新后的笔记放到列表开头
        this.notes.unshift(updatedNote);
        
        this.saveNotes();
        return updatedNote;
    }

    /**
     * 删除笔记
     */
    deleteNote(id) {
        const index = this.notes.findIndex(note => note.id === id);
        if (index === -1) return false;
        
        this.notes.splice(index, 1);
        this.saveNotes();
        return true;
    }
}

/**
 * 笔记API模块 - 使用本地存储
 */
class NoteApi {
    constructor() {
        this.storage = new NoteStorage();
        console.log('NoteApi initialized with local storage');
    }

    /**
     * 获取笔记列表
     */
    async getNotes() {
        try {
            const notes = this.storage.getAllNotes();
            return {
                success: true,
                data: notes
            };
        } catch (error) {
            console.error('获取笔记列表失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取单个笔记
     */
    async getNote(noteId) {
        try {
            const note = this.storage.getNote(noteId);
            if (!note) {
                throw new Error('笔记不存在');
            }
            return {
                success: true,
                data: note
            };
        } catch (error) {
            console.error('获取笔记失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 创建笔记
     */
    async createNote(noteData) {
        try {
            const note = this.storage.createNote(noteData);
            return {
                success: true,
                data: note
            };
        } catch (error) {
            console.error('创建笔记失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 更新笔记
     */
    async updateNote(noteId, noteData) {
        try {
            const note = this.storage.updateNote(noteId, noteData);
            if (!note) {
                throw new Error('笔记不存在');
            }
            return {
                success: true,
                data: note
            };
        } catch (error) {
            console.error('更新笔记失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 删除笔记
     */
    async deleteNote(noteId) {
        try {
            const success = this.storage.deleteNote(noteId);
            if (!success) {
                throw new Error('笔记不存在');
            }
            return {
                success: true
            };
        } catch (error) {
            console.error('删除笔记失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// 创建全局noteApi实例
const noteApi = new NoteApi(); 