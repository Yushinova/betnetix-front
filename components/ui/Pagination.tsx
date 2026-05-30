"use client";

import { Button, ButtonGroup } from "@heroui/react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  
  return (
    <div className={styles.pagination}>
      <ButtonGroup className={styles.buttonGroup}>
        <Button
          isDisabled={currentPage === 1}
          onPress={() => onPageChange(currentPage - 1)}
          className={styles.navButton}
        >
          &lt;
        </Button>
        
        {[1, 2, 3].map((page) => {
          if (page > totalPages) return null;
          return (
            <Button
              key={page}
              onPress={() => onPageChange(page)}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ""
              }`}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          isDisabled={currentPage === totalPages}
          onPress={() => onPageChange(currentPage + 1)}
          className={styles.navButton}
        >
          &gt;
        </Button>
      </ButtonGroup>
    </div>
  );
}