const trashService = require('../services/trashService');

/**
 * 휴지통 조회 컨트롤러
 */
const getTrash = async (req, res) => {
  try {
    const userId = req.user.userId;

    const trashItems = await trashService.getTrash(userId);

    res.status(200).json({
      success: true,
      data: trashItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '휴지통 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 영구 삭제 컨트롤러
 */
const permanentlyDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await trashService.permanentlyDelete(id, userId);

    res.status(200).json({
      success: true,
      message: '할일이 영구적으로 삭제되었습니다'
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 영구 삭제할 수 없는 상태입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 영구 삭제 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getTrash,
  permanentlyDelete
};