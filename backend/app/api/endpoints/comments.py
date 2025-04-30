from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.blog import Comment, BlogPost
from app.schemas.blog import Comment as CommentSchema
from app.schemas.blog import CommentCreate

router = APIRouter()

@router.get("/post/{post_slug}", response_model=List[CommentSchema])
def get_post_comments(
    post_slug: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Get the post
    post = db.query(BlogPost).filter(BlogPost.slug == post_slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Get top-level comments (no parent)
    comments = db.query(Comment).filter(
        Comment.post_id == post.id,
        Comment.parent_id.is_(None)
    ).offset(skip).limit(limit).all()
    
    return comments

@router.post("/post/{post_slug}", response_model=CommentSchema)
def create_comment(
    post_slug: str,
    comment: CommentCreate,
    parent_id: int = None,
    db: Session = Depends(get_db)
):
    # Get the post
    post = db.query(BlogPost).filter(BlogPost.slug == post_slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Check if parent comment exists if parent_id is provided
    if parent_id:
        parent_comment = db.query(Comment).filter(Comment.id == parent_id).first()
        if not parent_comment:
            raise HTTPException(status_code=404, detail="Parent comment not found")
        if parent_comment.post_id != post.id:
            raise HTTPException(status_code=400, detail="Parent comment does not belong to this post")
    
    # Create the comment
    db_comment = Comment(
        content=comment.content,
        author_name=comment.author_name,
        author_email=comment.author_email,
        post_id=post.id,
        parent_id=parent_id
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"} 